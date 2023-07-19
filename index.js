const companies = require('/Users/karuppiah/everyday-logs/2023/july/appsumo-july-latest-basic.json')
const taiko = require('taiko')

function getDealTermsAndConditions(doc) {
  let dealTermsAndConditions = []

  let dealTermsAndConditionsData = doc.querySelectorAll('div.deal-properties-container > ul.list-unstyled > li')

  for (let dealTermsAndConditionsDatum of dealTermsAndConditionsData) {
    dealTermsAndConditions.push(dealTermsAndConditionsDatum.innerText.trim())
  }

  return dealTermsAndConditions
}

function getFeaturesIncludedInAllPlans(doc) {
  let featuresIncludedInAllPlans = []

  let featuresIncludedInAllPlansData = doc.querySelectorAll('div.deal-properties-container.mt-3 > ul.list-unstyled > li')

  for (let featuresIncludedInAllPlansDatum of featuresIncludedInAllPlansData) {
    featuresIncludedInAllPlans.push(featuresIncludedInAllPlansDatum.innerText.trim())
  }

  return featuresIncludedInAllPlans
}

function getCompleteDetailsOfOtherPlans(doc) {
  let plans = []

  let plansInDropDown = doc.querySelectorAll('div.appsumo-dropdown-outer-container.pricing-table > div.appsumo-dropdown-inner-container > div.frontend-dropdown.dropdown-item')

  for (let p of plansInDropDown) {
    // Click drop down button
    doc.querySelector('div.appsumo-dropdown-outer-container.pricing-table > button').click()

    // Choose plan from drop down
    p.click()

    const firstFewPlansData = doc.querySelectorAll('ul#plans.list-unstyled > li.plan-item.plan')
    if (firstFewPlansData.length !== 3) {
      continue
    }

    const lastPlan = firstFewPlansData[firstFewPlansData.length - 1]
    const {
      planName,
      planCostMetaDetail,
      discountedCost,
      originalCost,
      feature,
    } = getPlan(lastPlan)

    plans.push({
      planName,
      planCostMetaDetail,
      discountedCost,
      originalCost,
      feature,
    })

  }

  return plans
}

function getText(htmlElement) {
  let text = ""
  if (htmlElement !== null) {
    text = htmlElement.innerText.trim()
  }
  return text
}

function getAllTexts(htmlElements) {
  let texts = []
  for (const htmlElement of htmlElements) {
    texts.push(getText(htmlElement))
  }
  return texts
}

function getPlan(planData) {
  // example: License Tier 1
  const planName = getText(planData.querySelector('div.planContainer > div > div.price > h4'))

  // example: one time purchase
  const planCostMetaDetail = getText(planData.querySelector('div.planContainer > div > div.price > div > p'))

  // discounted cost
  // example: $49
  const discountedCost = getText(planData.querySelector('div.planContainer > div > div.price > div > div.price-line > span:not([class*=original-price])'))

  // original cost
  const originalCost = getText(planData.querySelector('div.planContainer > div > div.price > div > div.price-line > span.original-price'))

  // features list
  const features = getAllTexts(planData.querySelectorAll('div.planContainer > div > ul.feature-list > li'))

  return {
    planName,
    planCostMetaDetail,
    discountedCost,
    originalCost,
    features
  }
}

function getCompleteDetailsOfFirstFewPlans(doc) {
  let plans = []
  let firstFewPlansData = doc.querySelectorAll('ul#plans.list-unstyled > li.plan-item.plan')

  for (let planData of firstFewPlansData) {
    const {
      planName,
      planCostMetaDetail,
      discountedCost,
      originalCost,
      features,
    } = getPlan(planData)

    plans.push({
      planName,
      planCostMetaDetail,
      discountedCost,
      originalCost,
      features,
    })
  }

  return plans
}

function getBasicDetailsOfAllPlans(doc) {
  let plans = []

  let basicPlanDetailsData = doc.querySelectorAll("#pdp-main-container > div > div.container.pdp-section > div > div.pdp-details-wrapper.row > section.d-none.d-lg-block.col-lg-5.col-xl-4 > div > div.pdp-buynow-container > div > div.pdp-buynow-card.pdp-buynow-card-top-padding > div.mt-3 > div > div.pdp-buynow-dropdown.mb-3.mb-lg-4 > div.appsumo-dropdown-outer-container.text-left.pricing-card > div > div.dropdown-item")
  for (let basicPlanDetailsDatum of basicPlanDetailsData) {
    let planName = "", currentCost = "", originalCost = ""
    let planNameAndCurrentCostDatum = basicPlanDetailsDatum.querySelector('span:not([class])')
    if (planNameAndCurrentCostDatum !== null) {
      planNameAndCurrentCostDataArray = planNameAndCurrentCostDatum.innerText.split(":")
      if (planNameAndCurrentCostDataArray.length === 2) {
        planName = planNameAndCurrentCostDataArray[0].trim()
        currentCost = planNameAndCurrentCostDataArray[1].trim()
      }
    }

    let originalCostDatum = basicPlanDetailsDatum.querySelector('span[class]')
    if (originalCostDatum !== null) {
      originalCost = originalCostDatum.innerText.trim()
    }

    plans.push({
      planName,
      currentCost,
      originalCost
    })
  }

  return plans
}

async function getAllDataOfProduct(productUrl) {
  try {
    await taiko.goto(productUrl)

    let {
      basicDetailsOfAllPlans,
      dealTermsAndConditions,
      featuresIncludedInAllPlans,
      completeDetailsOfAllPlans
    } = await taiko.evaluate(() => {
      let basicDetailsOfAllPlans = getBasicDetailsOfAllPlans(document)
      let dealTermsAndConditions = getDealTermsAndConditions(document)
      let featuresIncludedInAllPlans = getFeaturesIncludedInAllPlans(document)
      let completeDetailsOfFirstFewPlans = getCompleteDetailsOfFirstFewPlans(document)
      let completeDetailsOfOtherPlans = []

      if (basicDetailsOfAllPlans.length > 3) {
        completeDetailsOfOtherPlans = getCompleteDetailsOfOtherPlans(document)
      }

      let completeDetailsOfAllPlans = completeDetailsOfFirstFewPlans.concat(completeDetailsOfOtherPlans)

      return {
        basicDetailsOfAllPlans,
        dealTermsAndConditions,
        featuresIncludedInAllPlans,
        completeDetailsOfAllPlans
      }
    })

    return {
      basicDetailsOfAllPlans,
      dealTermsAndConditions,
      featuresIncludedInAllPlans,
      completeDetailsOfAllPlans
    }
  } catch (err) {
    console.log('Failed to do processing: ', err);
  };

  return {}
}

async function main() {
  await taiko.openBrowser({ headless: false })

  const index = 0
  //   for(let index = 0; index < companies.length; index++) {
  const company = companies[index]
  const {
    basicDetailsOfAllPlans,
    dealTermsAndConditions,
    featuresIncludedInAllPlans,
    completeDetailsOfAllPlans
  } = await getAllDataOfProduct(company.productUrl)

  companies[index].basicDetailsOfAllPlans = basicDetailsOfAllPlans;
  companies[index].dealTermsAndConditions = dealTermsAndConditions;
  companies[index].featuresIncludedInAllPlans = featuresIncludedInAllPlans;
  companies[index].completeDetailsOfAllPlans = completeDetailsOfAllPlans;
  //   }

  await taiko.closeBrowser()

  console.log(JSON.stringify(companies[index], null, 2));
  //   console.log(JSON.stringify(companies, null, 2));
}

main()
