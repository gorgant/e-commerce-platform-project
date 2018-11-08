import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { SharedModule } from '../shared.module';
import { ProductCategory } from '../models/product-category';
import { Product } from '../models/product';

@Injectable({
  providedIn: SharedModule
})
export class DataImporterService {

  private dataCollection: AngularFirestoreCollection<Product>;
   private productList: Product[] = [
      {
        'category' : 'vegetables',
        'categoryId' : 'CyMygC0vFNBLXPvt0xez',
        'imageUrl' : 'http://www.publicdomainpictures.net/pictures/170000/velka/spinach-leaves-1461774375kTU.jpg',
        'price' : 2.5,
        'title' : 'Spinach'
      },
      {
        'category' : 'bread',
        'categoryId' : 'nAkIDHxy4LjrxvUutb6f',
        'imageUrl' : 'https://static.pexels.com/photos/2434/bread-food-healthy-breakfast.jpg',
        'price' : 3,
        'title' : 'Freshly Baked Bread'
      },
      {
        'category' : 'fruits',
        'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
        'imageUrl' : 'https://pixnio.com/free-images/2017/03/17/2017-03-17-09-15-56.jpg',
        'price' : 1.75,
        'title' : 'Avacado'
      },
      {
        'category' : 'vegetables',
        'categoryId' : 'CyMygC0vFNBLXPvt0xez',
        'imageUrl' : 'https://static.pexels.com/photos/8390/food-wood-tomatoes.jpg',
        'price' : 2.5,
        'title' : 'Tomato'
      },
      {
        'category' : 'vegetables',
        'categoryId' : 'CyMygC0vFNBLXPvt0xez',
        'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Lettuce_Mini_Heads_%287331119710%29.jpg',
        'price' : 1,
        'title' : 'Lettuce'
      },
      {
        'category' : 'vegetables',
        'categoryId' : 'CyMygC0vFNBLXPvt0xez',
        'imageUrl' :
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Cauliflowers_-_20051021.jpg/1280px-Cauliflowers_-_20051021.jpg',
        'price' : 1.75,
        'title' : 'Cauliflower'
      },
      {
        'category' : 'fruits',
        'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
        'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Bananas.jpg/1024px-Bananas.jpg',
        'price' : 1.25,
        'title' : 'Banana'
      },
      {
        'category' : 'fruits',
        'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
        'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg',
        'price' : 1.7,
        'title' : 'Orange'
      },
      {
        'category' : 'fruits',
        'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
        'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg',
        'price' : 2,
        'title' : 'Apple'
      },
      {
        'category' : 'fruits',
        'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
        'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/3/36/Kyoho-grape.jpg',
        'price' : 2,
        'title' : 'Grape'
      },
      {
        'category' : 'fruits',
        'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
        'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Autumn_Red_peaches.jpg',
        'price' : 2,
        'title' : 'Peach'
      },
      {
        'category' : 'seasonings',
        'categoryId' : 'ucGTyQ6XXNh04zPEG42L',
        'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cinnamon-other.jpg',
        'price' : 0.5,
        'title' : 'Cinnamon Sticks'
      },
      {
        'category' : 'seasonings',
        'categoryId' : 'ucGTyQ6XXNh04zPEG42L',
        'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/4/48/Saffron_Crop.JPG',
        'price' : 3,
        'title' : 'Saffron'
      },
      {
        'category' : 'seasonings',
        'categoryId' : 'ucGTyQ6XXNh04zPEG42L',
        'imageUrl' : 'http://maxpixel.freegreatpicture.com/static/photo/1x/Seasoning-Powder-Curry-Spice-Ingredient-Turmeric-2344157.jpg',
        'price' : 0.75,
        'title' : 'Ground Turmeric'
      },
      {
        'category' : 'seasonings',
        'categoryId' : 'ucGTyQ6XXNh04zPEG42L',
        'imageUrl' : 'http://maxpixel.freegreatpicture.com/static/photo/1x/Ingredient-Herb-Seasoning-Seeds-Food-Coriander-390015.jpg',
        'price' : 0.5,
        'title' : 'Coriander Seeds'
      },
      {
        'category' : 'bread',
        'categoryId' : 'nAkIDHxy4LjrxvUutb6f',
        'imageUrl' :
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/' +
        'Fabrication_du_lavash_%C3%A0_Noravank_%286%29.jpg/1280px-Fabrication_du_lavash_%C3%A0_Noravank_%286%29.jpg',
        'price' : 1.25,
        'title' : 'Lavash Bread'
      },
      {
        'category' : 'bread',
        'categoryId' : 'nAkIDHxy4LjrxvUutb6f',
        'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Bagel-Plain-Alt.jpg',
        'price' : 1,
        'title' : 'Bagel Bread'
      },
      {
        'category' : 'fruits',
        'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
        'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Strawberries.jpg',
        'price' : 1.95,
        'title' : 'Strawberry'
      },
      {
        'category' : 'bread',
        'categoryId' : 'nAkIDHxy4LjrxvUutb6f',
        'imageUrl' : 'https://static.pexels.com/photos/416607/pexels-photo-416607.jpeg',
        'price' : 1.25,
        'title' : 'Baguette Bread'
      }
   ];

  constructor(private afs: AngularFirestore) {
    this.dataCollection = afs.collection<Product>('products');

  }

  launchImport() {
    this.populateList(this.productList);
    console.log('list populated');
  }

  private addItem(item: Product) {
    const autoId = this.afs.createId();
    const thisItem: Product = {
      id: autoId,
      title: item.title,
      price: item.price,
      category: item.category,
      categoryId: item.categoryId,
      imageUrl: item.imageUrl
    };
    console.log(thisItem);
    this.dataCollection.doc(autoId).set(thisItem);
  }

  private populateList(list: Product[]) {
    list.forEach(item => {
      this.addItem(item);
    });
  }
}

