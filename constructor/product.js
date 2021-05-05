class Product {
  constructor(id, productOwnerID, title, photo_link, desc, price) {
    this.id = id;
    this.productOwnerID = productOwnerID;
    this.photo_link = photo_link;
    this.title = title;
    this.desc = desc;
    this.price = price;
  }
}

export default Product;
