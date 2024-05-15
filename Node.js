const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let users = {};
let products = {
  "手机": { "price": 2999, "stock": 100, "sales": 0 },
  "电脑": { "price": 6999, "stock": 50, "sales": 0 }
};
let salespersons = {};
let purchaseLogs = [];

// 用户注册
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.status(400).json({ message: '用户名已存在' });
  }
  users[username] = password;
  res.status(200).json({ message: '注册成功' });
});

// 用户登录
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    res.status(200).json({ message: '登录成功' });
  } else {
    res.status(401).json({ message: '用户名或密码错误' });
  }
});

// 浏览商品
app.get('/products', (req, res) => {
  res.status(200).json(products);
});

// 购买商品
app.post('/buy', (req, res) => {
  const { productName } = req.body;
  if (products[productName].stock > 0) {
    products[productName].stock--;
    products[productName].sales++;
    purchaseLogs.push(`${new Date().toLocaleString()} - 用户购买了 ${productName}`);
    res.status(200).json({ message: '购买成功' });
  } else {
    res.status(400).json({ message: '库存不足' });
  }
});

// 商品目录管理
app.post('/addProduct', (req, res) => {
  const { productName, price, stock } = req.body;
  products[productName] = { "price": price, "stock": stock, "sales": 0 };
  res.status(200).json({ message: '商品添加成功' });
});

app.delete('/deleteProduct/:productName', (req, res) => {
  const productName = req.params.productName;
  if (products[productName]) {
    delete products[productName];
    res.status(200).json({ message: '商品删除成功' });
  } else {
    res.status(404).json({ message: '商品不存在' });
  }
});

// 销售人员ID管理
app.post('/addSalesperson', (req, res) => {
  const { salespersonId } = req.body;
  salespersons[salespersonId] = true;
  res.status(200).json({ message: '销售人员ID添加成功' });
});

app.delete('/deleteSalesperson/:salespersonId', (req, res) => {
  const salespersonId = req.params.salespersonId;
  if (salespersons[salespersonId]) {
    delete salespersons[salespersonId];
    res.status(200).json({ message: '销售人员ID删除成功' });
  } else {
    res.status(404).json({ message: '销售人员ID不存在' });
  }
});

// 商品信息修改
app.put('/modifyProduct/:productName', (req, res) => {
  const productName = req.params.productName;
  const { price, stock } = req.body;
  if (products[productName]) {
    products[productName].price = price;
    products[productName].stock = stock;
    res.status(200).json({ message: '商品信息更新成功' });
  } else {
    res.status(404).json({ message: '商品不存在' });
  }
});

// 销售状态监控
app.get('/salesStatus', (req, res) => {
  res.status(200).json(products);
});

// 用户购买日志记录
app.get('/purchaseLog', (req, res) => {
  res.status(200).json(purchaseLogs);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});