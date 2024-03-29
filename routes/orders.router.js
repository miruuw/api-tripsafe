const {Order} = require('../models/order.model');
const {OrderItem} = require('../models/order-item');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort('dateOrdered');

    if(!orderList) {
        res.status(500).json({success: false})
    }
    res.send(orderList);
})

router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name').populate({
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'
        }
    });

    if(!order) {
        res.status(500).json({success: false})
    }
    res.send(order);
})

router.post('/', async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        var newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id
    }))

    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async(orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
    }))

    // const totalPrice = totalPrices.reduce((a, b) => a + b, 0)
    // console.log(totalPrices);

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order)
    return res.status(404).send('Pemesanan tidak dapat dibuat!')

    res.send(order);
})

router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id, {
            status: req.body.status
        },
        { new : true}
    )

    if(!order)
    return res.status(400).send('kategori tidak dapat dibuat!')

    res.send(order);
})

router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(order => {
        if(order) {
            return res.status(200).json({success: true, message: 'data order berhasil dihapus!'})
        } else {
            return res.status(404).json({success: true, message: 'data order tidak ada!'})
        }
    }).catch(err=> {
        return res.status(400).json({success: false, error: err})
    })
})

// router.get('/get/totalsales', async (req, res) => {
//     const totalSales = await Order.aggregate([
//         {$group: { _id: null, totalsales : { $sum : '$totalPrice'}}}
//     ])

//     if(!totalSales){
//         return res.status(400).send('data order tidak dapat tergenerate!')
//     }

//     res.send({totalsales: totalSales.pop().totalsales});
// })

router.get('/get/totalsales', async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
        ]);

        if (totalSales.length === 0) {
            return res.status(404).send('Data order tidak ditemukan!');
        }

        res.send({ totalsales: totalSales[0].totalsales });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat mengambil total penjualan!');
    }
});


router.get(`/get/count`, async (req, res)=>{
    const orderCount = await Order.countDocuments();

    if(!orderCount) {
        res.status(500).json({success: false})
    }
    res.send({
        orderCount: orderCount
    })
})

router.get(`/get/userorders/:userid`, async (req, res) => {
    const userOrderList = await Order.find({user: req.params.userid}).populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }
    }).sort({'dateordered': -1});

    if(!userOrderList){
        res.status(500).json({success: false})
    }
    res.send(userOrderList);
})

module.exports = router;