// Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Clicks on the expand all if necessary
const expandTabs = async () => {
  // Grabs `Expand All`/`Collapse All` tag thru jquery + xpath
  const tag = document.querySelector("#root > div > div.flex.h-full.flex-col.w-full > div.flex.h-full > div.w-containerWidth.flex-auto.mobile\\:mt-25.desktop\\:ml-98 > div.flex.justify-between.border-bottom.h-20\\.8.ml-10 > div > button > div")
  if (tag !== undefined) {
    if (tag.innerHTML !== 'Collapse all') { // Checks to see if we need to expand the videos
      tag.click() // Clicks on the `Expand All` button
      await sleep(500) // Wait for page to load
    }
  } else {
    console.error('Could not find Expand All/Collapse All button')
  }
}

const getUnitVideoIds = () => {
  // Matches for /1/home?apd=(Video ID)
  return [...document.documentElement.innerHTML.matchAll(/<a id="video-(\w{10})" class=".+?" aria-label="(\d+\.\d+):.+?" href="\/\d+\/home\?apd=(\w{10})/g)].map(x => [x[1], x[2]])
}

const getCourseIds = async () => {
  let pages = {} // All the pages it visits
  let unitList = document.querySelector("#items-container-course-resource") // Unit sidebars
  if (unitList !== undefined) { // Checks to make sure sidebar is fine
    for (let unit of unitList.children) { // Goes through all the units in the sidebar
      let aTag = unit.children[0] // <a> tag to click on
      let unitName = aTag?.children[0]?.children[0]?.innerText // Unit name

      if (aTag !== undefined && unitName !== undefined) { // Making sure both are valid
        await aTag.click() // Goes to the page
        await sleep(500) // Waits for the page to load
        await expandTabs() // Expands all the tabs

        pages[unitName] = getUnitVideoIds() // Grabs all the video ids and throws them into the object
      } else {
        console.error('Could not find data for unit', unitName, 'with tag', aTag)
      }
    }
  } else {
    console.error('Could not find unit list side bar')
  }

  return pages
}

console.log(JSON.stringify(await getCourseIds()))
