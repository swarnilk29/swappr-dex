// Import required modules
const express = require("express");  //Created the server 
const Moralis = require("moralis").default;  // Moralis SDK to interact with the blockchain and get token data
const app = express();  // Create an instance of an Express application
const cors = require("cors");  // CORS middleware to handle cross-origin requests
require("dotenv").config();
const port = 3001; 

// Middleware to allow cross-origin requests
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to get the price ratio between two tokens
app.get("/tokenPrice", async (req, res) => {
  const { query } = req;  // Destructure query parameters from the request URL

  // Fetch price data for the first token using its address from the query parameters
  const responseOne = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressOne  // The address of the first token
  });

  // Fetch price data for the second token using its address from the query parameters
  const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressTwo  // The address of the second token
  });

  // Prepare the response data
  const usdPrices = {
    tokenOne: responseOne.raw.usdPrice,  // USD price of the first token
    tokenTwo: responseTwo.raw.usdPrice,  // USD price of the second token
    ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice  // Calculate the price ratio between the two tokens
  };

  // Return the USD prices and price ratio as a JSON response
  return res.status(200).json(usdPrices);
});

// Initialize Moralis with the API key stored in environment variables
Moralis.start({
  apiKey: process.env.MORALIS_KEY,  // API key for Moralis from .env
}).then(() => {
  // Start the Express server and listen on the specified port (3001)
  app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
  });
});
