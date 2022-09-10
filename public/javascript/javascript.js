   
  
  const total = localStorage.getItem("CartTotal");
  const TotalPrice = JSON.parse(total);
  let amount = TotalPrice * 100;
  
  var sdk = new window.YocoSDK({
    publicKey: 'pk_live_c2eec24eKbAyB9N9fe94',
  });

  var inline = sdk.inline({
    layout: 'basic',
    amountInCents: amount,
    currency: 'ZAR'
  });
  // this ID matches the id of the element we created earlier.
  inline.mount('#card-frame');
  


  var form = document.getElementById('payment-form');
  var submitButton = document.getElementById('pay-button');
  form.addEventListener('submit', function (event) {
    event.preventDefault()
    // Disable the button to prevent multiple clicks while processing
    submitButton.disabled = true;
    // This is the inline object we created earlier with the sdk
    inline.createToken().then(function (result) {
      // Re-enable button now that request is complete
      // (i.e. on success, on error and when auth is cancelled)
      submitButton.disabled = false;
      if (result.error) {
        const errorMessage = result.error.message;
        errorMessage && alert("error occured: " + errorMessage);
      } else {
        const token = result;
        alert("card successfully tokenised: " + token.id);

        fetch('/pay',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({token:token.id})
        }).then((response)=> response.json())
        .then((data)=>{
            console.log(data)
            location.href='http://localhost:3000/success'
        })
      }
    }).catch(function (error) {
      // Re-enable button now that request is complete
      submitButton.disabled = false;
      alert("error occured: " + error);
    });
  });

  function getProduct() {
    const CartProduct = localStorage.getItem("Cart");
    db.collection("CartItems").doc('96325').get().then((snap)=>{
console.log(snap.data())
    const products = snap.data().MyCart
    const Qua = localStorage.getItem("CartQuantity");
    const quntity = JSON.parse(Qua);
    document.getElementById("quantity").innerHTML=snap.data().Quant;
    const total = localStorage.getItem("CartTotal");
    const TotalPrice = JSON.parse(total);
    document.getElementById("totalP").innerHTML=snap.data().Total;
    document.getElementById("pro").innerHTML=snap.data().Total;
    console.log(products)
    const List = document.getElementById("listproducts")
    let html ='';
    let div ='';
    products.forEach(element => {
        div=`
        <div class="product">
        <div class="product-I-N">
        <div class="img-cont">
            <img src="${element.Image[0]}" alt="">
        </div>
        <h5>${element.productName} X${element.quantity}</h5>
        </div>
        <h4>R${element.price}</h4>
        </div> 
        `
        html +=div;
        List.innerHTML=html;
    });
  })
  }
  getProduct()