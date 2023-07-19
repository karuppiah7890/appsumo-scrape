// Running this on the https://appsumo.com/softwares webpage after scrolling till the end gives all the company and basic product details

const companyCards = document.querySelectorAll("#headlessui-portal-root > div > div > div > main > div > div.grid.grid-cols-150.gap-4.md\\:grid-cols-215.md\\:gap-5.xl\\:grid-cols-260.\\32 xl\\:gap-8 > div")

const companies = []

function getTotalDownloads(companyCard) {
  const totalDownloads = companyCard.querySelector("div > div.flex.grow.flex-col.pb-1.max-md\\:pt-2.md\\:p-4.md\\:text-center > div.relative.md\\:text-center > div.mt-0\\.5.mb-2\\.5.flex.items-center.gap-3.text-xs.font-bold.justify-start.md\\:justify-center")
  if (totalDownloads === null) {
    return "Not available"
  }

  return totalDownloads.innerText.split(":")[1].replaceAll(",", "").trim()
}

function getReviewCount(companyCard) {
  let reviewCountString = "Not available"
  let reviewsLink = companyCard.querySelector('a[href$="reviews"]')

  if (reviewsLink === null) {
    return reviewCountString
  }

  // example: '158 reviews'
  let reviewsLinkText = reviewsLink.innerText

  if (!reviewsLinkText.includes("reviews")) {
    return reviewCountString
  }

  // example: ['158', 'reviews']
  let reviewCountAndExtraText = reviewsLinkText.split(' ')

  if (reviewCountAndExtraText.length !== 2) {
    return reviewCountString
  }

  // example: '158'
  reviewCountString = reviewCountAndExtraText[0]

  return reviewCountString.replaceAll(",", "")
}

function getCompanyProductDescription(companyCard) {
  let companyProductData = companyCard.querySelectorAll('.my-1')

  if (companyProductData.length !== 1) {
    return ""
  }

  const companyProductDescription = companyProductData[0].innerText

  return companyProductDescription
}

function getCompanyProductName(companyCard) {
  let companyProductData = companyCard.querySelectorAll('span.overflow-hidden.text-ellipsis.whitespace-nowrap.font-bold.max-md\\:text-xs')

  if (companyProductData.length !== 1) {
    return ""
  }

  const companyProductName = companyProductData[0].innerText

  return companyProductName
}

function getProductCost(companyCard) {
  let currentCost = "Not available", originalCost = "Not available";

  let productCostData = companyCard.querySelectorAll('div.font-medium.md\\:text-2xl')

  if (productCostData.length !== 1) {
    return { currentCost, originalCost }
  }

  let currentCostData = productCostData[0].querySelectorAll('span:not([class])')

  if (currentCostData.length === 1) {
    currentCost = currentCostData[0].innerText.replaceAll(",", "").trim()
  }

  let originalCostData = productCostData[0].querySelectorAll('span.ml-2.text-sm.font-normal.text-grace.line-through')

  if (originalCostData.length === 1) {
    originalCost = originalCostData[0].innerText.replaceAll(",", "").trim()
  }

  return { currentCost, originalCost }
}

function getProductCategory(companyCard) {
  const productCategoryData = companyCard.querySelectorAll('a.relative.z-1.underline')

  if (productCategoryData.length !== 1) {
    return ""
  }

  const productCategory = productCategoryData[0].innerText

  return productCategory
}

function getProductUrl(companyCard) {
  return companyCard.querySelector('a').href
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

function main() {
  for(let index = 0; index < companyCards.length; index++) {
    const companyCard = companyCards[index]
    const productName = getCompanyProductName(companyCard)
    const productUrl = getProductUrl(companyCard)
    const productCategory = getProductCategory(companyCard)
    const productDescription = getCompanyProductDescription(companyCard)
    const reviewCount = getReviewCount(companyCard)
    const productCost = getProductCost(companyCard)
    const totalDownloads = getTotalDownloads(companyCard)
  
    const company = {
      productName,
      productUrl,
      productCategory,
      productDescription,
      reviewCount,
      totalDownloads,
      currentCost: productCost.currentCost,
      originalCost: productCost.originalCost,
    }
  
    companies.push(company)
  }
   
}

main()
