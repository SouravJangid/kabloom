const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const axios = require("axios");
const app = express();
var cors = require("cors");
const { get: _get, isEmpty: _isEmpty } = require("lodash");

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "2000kb" }));
app.use(pino);
app.use(cors());

// const application_bff_url = "https://apidev.drinkindia.com";

// const application_bff_url = "https://dev.drinkindia.com/api";

// const application_bff_url = "https://devshop.kabloom.com/api";
const application_bff_url = "https://apiuat.kabloom.com/";

// const application_bff_url = "https://dev.drinksbucket.com/api";
// const application_bff_url   = "https://drinksbucket.com/api";

// const application_bff_url = "https://apiprod.drinkindia.com/api";

// const application_bff_url = "https://apidev.drinksbucket.com";
// const application_bff_url = "https://apiprod.drinksbucket.com";

// const application_bff_url = "https://apidev.kabloom.com/api"

app.get("/connect/index/banners", (req, res) => {
  let p1 = axios.get(`${application_bff_url}/connect/index/banners?store_id=1`);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.get("/connect/index/homepage", (req, res) => {
  // const zipState = req.query.zipState;
  const zipcode = req.query.zipcode;
  // const location = req.query.location;
  const locTime = req.query.dineinTime;
  const retailer = req.query.loc_id;
  let urlparam = "";
  const courier_type = req.query.courier_type;
  //   if (!_isEmpty(zipState) && !_isEmpty(location)) {
  //     urlparam = `/connect/index/homepage?store_id=1&state=${zipState}&location=${location}&dineinTime=${locTime}&retailer=${retailer}`;
  // } else if (!_isEmpty(zipState)){
  //     urlparam = `/connect/index/homepage?store_id=1&state=${zipState}&dineinTime=${locTime}&retailer=${retailer}`;
  // } else if (!_isEmpty(location)) {
  //     urlparam = `/connect/index/homepage?store_id=1&location=${location}&dineinTime=${locTime}&retailer=${retailer}`;
  // }

  if (!_isEmpty(zipcode)) {
    urlparam = `/connect/index/homepage?store_id=1&zipcode=${zipcode}&loc_id=${retailer}&courier_type=${courier_type}`;
  } else {
    urlparam = `/connect/index/homepage?store_id=1&zipcode=&loc_id=${retailer}&courier_type=${courier_type}`;
  }

  let p1 = axios.get(`${application_bff_url}${urlparam}`);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/checkout/paymentmethods", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/checkout/paymentmethods`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/api/account/stripeDetails", (req, res) => {
  console.log(req.body, "stripe details");
  let p1 = axios.post(
    `${application_bff_url}/api/account/stripeDetails`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/account/mycards", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/api/account/mycards`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/fedexApi", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/api/fedexApi`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/placeorder/placeorder", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/placeorder/placeorder`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.get("/connect/index/getaddressbyzipcode", (req, res) => {
  const zipcode = req.query.zipcode;
  // const store = req.query.store;
  let p1 = axios.get(
    `${application_bff_url}/connect/index/getaddressbyzipcode?zipcode=${zipcode}&store_id=1`
  );
  // console.log(`${application_bff_url}/connect/index/getaddressbyzipcode?zipcode=${zipcode}&store_id=1`, 'check 2');
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

//this is code i added for search api proxy
app.get("/connect/index/search", (req, res) => {
  const q = req.query.q || "";
  const store_id = req.query.store_id || 1;
  const zipcode = req.query.zipcode || "";
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;

  const searchUrl = `${application_bff_url}/connect/index/search?q=${encodeURIComponent(
    q
  )}&store_id=${store_id}&zipcode=${zipcode}&page=${page}&limit=${limit}`;

  console.log("Calling backend:", searchUrl);

  axios
    .get(searchUrl)
    .then((apiRespo) => {
      res.setHeader("Content-Type", "application/json");
      res.send(apiRespo.data);
    })
    .catch((err) => {
      console.error(
        "Search proxy error:",
        err.response?.status,
        err.response?.data || err.toString()
      );
      res.status(err.response?.status || 500).send({
        error: "Proxy error",
        details: err.response?.data || err.toString(),
      });
    });
});

app.post("/api/customer/login", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  let p1 = axios.post(
    `${application_bff_url}/api/customer/login?email=${email}&password=${password}`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/connect/customer/deleteAddress", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/connect/customer/deleteAddress`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("connect/citylist/currentservicearea", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/connect/citylist/currentservicearea`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/connect/customer/updateAddress", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/connect/customer/updateAddress`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/wallet/wallet/index", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/wallet/wallet/index`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});
app.post("/connect/driverslot/getslot", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/connect/driverslot/getslot`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/walletproductlst/walletProducts", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/walletproductlst/walletProducts`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/wallet/wallet/walletAddToCart", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/wallet/wallet/walletAddToCart`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/vendorsbyproduct/applyproducts", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/vendorsbyproduct/applyproducts`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/connect/verifycustomer/verify", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/connect/verifycustomer/verify`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/connect/uploadkyc/kyc", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/connect/uploadkyc/kyc`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/connect/verifyorder/verify", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/connect/verifyorder/verify`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/customer/customerverify", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/customer/customerverify`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/customer/register", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  const confirm_pswd = req.query.confirm_pswd;
  const first_name = req.query.first_name;
  const last_name = req.query.last_name;
  let p1 = axios.post(
    `${application_bff_url}/api/customer/register?email=${email}&password=${password}&confirm_password=${confirm_pswd}&first_name=${first_name}&last_name=${last_name}`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/connect/customer/getaddresses", (req, res) => {
  const customerid = req.query.customerid;
  let p1 = axios.post(
    `${application_bff_url}/connect/customer/getaddresses?customerid=${customerid}`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/cart/showcart", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/api/cart/showcart`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/cart/showcart", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/api/cart/showcart`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/cart/addtocart", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/api/cart/addtocart`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.get("/connect/index/categorylist", (req, res) => {
  const zipcode = req.query.zipcode;
  const courier_type = req.query.courier_type;
  let p1 = axios.get(
    `${application_bff_url}/connect/index/categorylist?store_id=1&courier_type=${courier_type}`
  );
  p1.then((apiRespo) => {
    // console.log(res.data)
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.get("/connect/index/category", (req, res) => {
  const categoryID = req.query.catid;
  const zipcode = req.query.zipcode;

  // const location = req.query.location;
  const locTime = req.query.dineinTime;
  const retailer = req.query.loc_id;
  const courier_type = req.query.courier_type;
  const { page, limit } = req.query;

  let urlparam = "";

  if (!_isEmpty(zipcode)) {
    urlparam = `/connect/index/category?catid=${categoryID}&store_id=1&zipcode=${zipcode}&loc_id=${retailer}&courier_type=${courier_type}&page=${page}&limit=${limit}`;
  } else {
    urlparam = `/connect/index/category?catid=${categoryID}&store_id=1&zipcode=&loc_id=${retailer}&courier_type=${courier_type}&page=${page}&limit=${limit}`;
  }

  // console.log('url home', urlparam);

  let p1 = axios.get(`${application_bff_url}${urlparam}`);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.get("/connect/index/product", (req, res) => {
  const ProductID = req.query.prodid;
  const loc_id = req.query.loc_id;
  const dineinTime = req.query.dineinTime;
  const zipcode = req.query.zipCode;
  const couriertype = req.query.courier_type;
  // console.log(application_bff_url, 'check 1');
  // console.log(`${application_bff_url}/connect/index/product?prodid=${ProductID}&store_id=1&loc_id=${loc_id}&dineinTime=${dineinTime}&zipCode=${zipcode}`)
  // let p1 = axios.get(`${application_bff_url}/connect/index/product?prodid=${ProductID}&store_id=1`);
  let p1 = axios.get(
    `${application_bff_url}/connect/index/product?prodid=${ProductID}&store_id=1&loc_id=${loc_id}&dineinTime=${dineinTime}&zipCode=${zipcode}&courier_type=${couriertype}`
  );

  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/connect/customer/addaddress", (req, res) => {
  const customerid = req.query.customerid;
  let p1 = axios.post(
    `${application_bff_url}/connect/customer/addaddress?customerid=${customerid}`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/shipping", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/api/shipping`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/product/dineinRetailerList", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/product/dineinRetailerList`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/cart/deleteitem", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/api/cart/deleteitem`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.get("/category/");

app.post("/api/cart/updateitem", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/api/cart/updateitem`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/payuapi/payu/payuGetcards", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/payuapi/payu/payuGetcards`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/payuapi/payu/payuBin", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/payuapi/payu/payuBin`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/payuapi/payu/payucreateorder", (req, res) => {
  // let p1 = axios.post(`${application_bff_url}/api/placeorder/placeorder`, req.body);
  // let p1 = axios.post('https://apidev.drinkindia.com/payuapi/payu/payucreateorder', req.body);
  let p1 = axios.post(
    `${application_bff_url}/payuapi/payu/payucreateorder`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/account/mydashboard", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/account/mydashboard`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/account/myorders", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/api/account/myorders`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/connect/index/search", (req, res) => {
  const { q, page, limit, zipcode, loc_id, courier_type } = req.query;

  let p1 = axios.post(
    `${application_bff_url}/connect/index/search?q=${q}&store_id=1&zipcode=${zipcode}&loc_id=${loc_id}&courier_type=${courier_type}&page=${page}&limit=${limit}`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/payuapi/payu/payuSavedcards", (req, res) => {
  const body = {
    ...req.body,
  };
  delete body["store_id"];
  let p1 = axios.post(
    `${application_bff_url}/payuapi/payu/payuSavedcards`,
    body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/payuapi/payu/varifyUpi", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/payuapi/payu/varifyUpi`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/connect/customer/addaddress", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/connect/customer/addaddress`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/cart/guestcart", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/api/cart/guestcart`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/checkout/orderreview", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/checkout/orderreview`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/customer/forgot", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/api/customer/forgot`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/customer/changepassword", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/customer/changepassword`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/connect/index/filters", (req, res) => {
  let p1 = axios.post(`${application_bff_url}/connect/index/filters`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});
app.post("/api/account/deletecard", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/account/deletecard`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/cart/clearCart", (req, res) => {
  const customerId = req.query.cus_id;
  const apiToken = req.query.api_token;
  const cartId = req.query.quote_id;
  let p1 = axios.post(
    `${application_bff_url}/api/cart/clearCart?cus_id=${customerId}&api_token=${apiToken}&quote_id=${cartId}`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/account/RemoveCreditCard", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/account/RemoveCreditCard`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/customer/setdefaultshippingaddress", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/customer/setdefaultshippingaddress`,
    req.body
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/connect/delivery/nextDeliveryDate", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/connect/delivery/nextDeliveryDate`,
    req.body
  );
  // https://dev.kabloompartners.com/index.php/api/index/nextDeliveryDate
  // let p1 = axios.post(`https://dev.kabloompartners.com/index.php/api/index/nextDeliveryDate`, req.body);
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.get("/api/agent/search", (req, res) => {
  const searchName = req.query.query;
  let p1 = axios.get(
    `${application_bff_url}/api/agent/search?query=${searchName}`
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.get("/api/agent/recommendation", (req, res) => {
  const ProductID = req.query.product_id;
  const loc_id = req.query.loc_id;
  const store_id = req.query.store_id;
  const zipcode = req.query.zipCode;
  const limit = req.query.limit;
  // console.log(application_bff_url, 'check 1');
  // console.log(`${application_bff_url}/connect/index/product?prodid=${ProductID}&store_id=1&loc_id=${loc_id}&dineinTime=${dineinTime}&zipCode=${zipcode}`)
  // let p1 = axios.get(`${application_bff_url}/connect/index/product?prodid=${ProductID}&store_id=1`);
  let p1 = axios.get(
    `${application_bff_url}/api/agent/recommendation?product_id=${ProductID}&store_id=1&loc_id=${loc_id}&zipCode=${zipcode}&limit=${limit}`
  );

  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.send(err);
  });
});

app.post("/api/Vendordata/getVendorData", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/Vendordata/getVendorData`,
    req.body,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.status(500).send({ error: "Proxy error", details: err.toString() });
  });
});
app.post("/api/Vendordata/getFilteredProducts", (req, res) => {
  let p1 = axios.post(
    `${application_bff_url}/api/Vendordata/getFilteredProducts`,
    req.body,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  p1.then((apiRespo) => {
    res.setHeader("Content-Type", "application/json");
    res.send(apiRespo.data);
  });
  p1.catch((err) => {
    res.setHeader("Content-Type", "application/json");
    res.status(500).send({ error: "Proxy error", details: err.toString() });
  });
});

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
