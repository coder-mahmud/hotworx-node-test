const url = require('url')
const express = require('express')
const router = express.Router()
const needle = require('needle')
const apicache = require('apicache')

// Env vars
const API_KEY_VALUE = process.env.API_KEY_VALUE

// Init cache
let cache = apicache.middleware

router.get('/', cache('1 minutes'), async (req, res, next) => {


try {
  //   const params = new URLSearchParams({
  //     [API_KEY_NAME]: API_KEY_VALUE,
  //     ...url.parse(req.url, true).query,
  //   })

  //   const apiRes = await needle('get', `${API_BASE_URL}?${params}`)
  //   const data = apiRes.body

  //   // Log the request to the public API
  //   if (process.env.NODE_ENV !== 'production') {
  //     console.log(`REQUEST: ${API_BASE_URL}?${params}`)
  //   }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Bearer bdb47ad338896ff91f7d7a64236a91640ecf45826e9cb24f604d69b11ed9eb87'
    }
  };

  const queryItems = async (i) => {


    const fetchedData = await fetch(`https://api.webflow.com/collections/6200494f4003ab206ae2aacf/items?offset=${i}&limit=100`, options)
      .then(response => response.json())
      .then(response => {
        //console.log(response);
        return response.items;
      })
      .catch(err => console.error(err));

      return fetchedData;
  }

  const allItemsNumber = await needle('get', `https://api.webflow.com/collections/6200494f4003ab206ae2aacf/items?offset=100&limit=100`, {

    headers: {
      accept: 'application/json',
      authorization: API_KEY_VALUE
    }

  })
  const data = allItemsNumber.body



  // let allItemsNumber  = await fetch('https://api.webflow.com/collections/6200494f4003ab206ae2aacf/items?offset=100&limit=100', options)
  //   .then(response => response.json())
  //   .then(response => response.total)
  //   .catch(err => console.error(err));


    console.log("Total Items:", data.items);
    
  const allPagesCount = Math.ceil(data.total / 100);
  console.log("Total Pages:", allPagesCount);


/*
  let concatedArray = [];
  for (let i = 0; i < allPagesCount; i++) {

    let queredDataInLoop = await queryItems(i * 100);
    concatedArray = concatedArray.concat(queredDataInLoop);

  }
  console.log("Initial Items",concatedArray);
  const allItems = [];
  for(const item of concatedArray){
    allItems.push({title: item.name, flag: item['studio-flag'], zip: item['zip-code'], id:item['_id']});
  }

  console.log("All Res", allItems);  
*/




    res.status(200).json(data.items)
  } catch (error) {
    next(error)
  }
})

module.exports = router
