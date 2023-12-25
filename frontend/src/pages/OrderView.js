
import React from 'react';
import './OrderView.css';
import { useEffect, useState } from 'react';


// Header includes table number, name of server, section colour, and the time that the order has been up.
function HeaderSection({ orderNumber, time }) { 
  return (
    <div className="header-section">
      <div className= "label">{orderNumber}</div>
      <div className= "label">{time}</div>
    </div>
  );
}


function OrderSection({ content, specialNotes }) {
  // keep track of the amount of each item, assuming orders are stored in an array
  const itemQuantities = {};
  content.forEach(function (x) { itemQuantities[x] = (itemQuantities[x] || 0) + 1; });
  return (
    //display orders, quantities, and special notes below the header
    <div>
    {specialNotes && ( //display the special notes if there are any
      <div className="order-special-notes">
        <div className="label">SPECIAL NOTES: {specialNotes}</div>
      </div>
    )}
    <div className="order-section">
      <div className="order-labels">
        <div className="label">Dish</div>
        <div className="label">Quantity</div>
      </div>

      {/* put keys into an array to display */}
      {Object.keys(itemQuantities).map((item, index) => (
        <div key={index} className="order-item-layout">
          <div className="dish-name">{item}</div>
          <div className="item-quantity">{itemQuantities[item]}</div>
        </div>
      ))}
    </div>
  </div>
);
}

// function for one single order
function Order({ orderId, orderNumber, createdAt, content, specialNotes, onOrderClear }) {
  const [timer, setTimer] = useState(() => {
    const currentTime = new Date().getTime(); // current time
    const startTime = new Date(createdAt).getTime(); // order createdAt
    const elapsedTime = Math.floor((currentTime - startTime) / 1000); // get the time elapsed in seconds
    return elapsedTime;
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000); // 1000ms = 1 second interval

    return () => clearInterval(interval); // clear when order is deleted
  }, []);

  const minutes = Math.floor(timer / 60); // get the minutes and seconds
  const seconds = timer % 60;

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; //convert to string in the form of MM:SS

// function to clear the order
const handleClearOrder = async () => {

    // update the dishArray to be an empty array
    const res = await fetch(`/api/order/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dishArray: [], // set dishArray to an empty array
      }),
    });

    if (res.ok) {
      onOrderClear();
    }

};


  return (
    <div className="item">
      <HeaderSection orderNumber={orderNumber} time={formattedTime} />
      <OrderSection content={content} specialNotes={specialNotes} />
      <button className="button-clear-order"onClick={handleClearOrder}>Finish Order</button>
    </div>
  );
}





// function to display the orders
function OrderView() {
  const [orderContent, setOrderContent] = useState([]);
  const [orders, setOrders] = useState([]);


  // get all orders
    const fetchOrders = async () => {
      const res = await fetch('/api/order');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    };

  useEffect(() => {
    fetchOrders();
  }, []); 

  const handleOrderClear = () => {
    //fetch orders again when an order is cleared
    fetchOrders();
  };

  //get orders and dishes
  useEffect(() => {
    const fetchOrderDetails = async (orderIds) => {
      const orderData = await Promise.all( // wait for all fetch requests
        orderIds.map(async (orderId) => {
          const res = await fetch(`/api/order/${orderId}`);
          if (res.ok) {
            const order = await res.json();
            const orderCreatedAt = order.createdAt; //get the date created
            const orderName = order.title
            const specialNotes = order.specialNotes;
            const dishDetails = await fetchDishDetails(order.dishArray); //get the dish array
            return {
              orderId: order._id,
              orderCreatedAt,
              orderName,
              specialNotes,
              dishes: dishDetails,
            };
          }
          return null;
        })
      );
      return orderData.filter(data => data && data.dishes.length > 0); // filter out null values and orders with no dishes
    };
  
    const fetchDishDetails = async (dishIds) => {
      const dishData = await Promise.all(
        dishIds.map(async (dishId) => {
          const res = await fetch(`/api/dish/singledish/${dishId}`);
          if (res.ok) {
            const dish = await res.json();
            return dish.name; // get dish name only
          }
          return null;
        })
      );
      return dishData.filter(name => name); // filter out null values
    };
  
    const extractOrderContent = async () => {
      const orderIDs = orders.map((order) => order._id); // get order ids
      console.log(orderIDs);

      const onlyDishes = await fetchOrderDetails(orderIDs);

      setOrderContent(onlyDishes);
    };

    if (orders && orders.length > 0) {
      extractOrderContent();
    }
  }, [orders]);


  return (
    <div className="grid-container">
      {orderContent.map((orderData, index) => {
        return (
          <div key={index}>
            <Order
              orderId={orderData.orderId}
              orderNumber={orderData.orderName}
              createdAt={orderData.orderCreatedAt} // order createdAt
              content={orderData.dishes} //array of dishes
              specialNotes={orderData.specialNotes} // specialNotes
              onOrderClear={handleOrderClear} // pass the callback to the Order component
            />
          </div>
        );
      })}
    </div>
  );
}

export default OrderView;



