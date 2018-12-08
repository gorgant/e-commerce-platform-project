import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { SharedModule } from '../../shared.module';
import { Product } from '../../models/product';

@Injectable({
  providedIn: SharedModule
})
export class ProductImporterService {

  private dataList: Product[] =
  [
    {
      'categoryValue' : 'vegetables',
      'categoryId' : 'CyMygC0vFNBLXPvt0xez',
      'imageUrl' : 'http://www.publicdomainpictures.net/pictures/170000/velka/spinach-leaves-1461774375kTU.jpg',
      'price' : 2.5,
      'title' : 'Spinach'
    },
    {
      'categoryValue' : 'bread',
      'categoryId' : 'nAkIDHxy4LjrxvUutb6f',
      'imageUrl' : 'https://static.pexels.com/photos/2434/bread-food-healthy-breakfast.jpg',
      'price' : 3,
      'title' : 'Freshly Baked Bread'
    },
    {
      'categoryValue' : 'fruits',
      'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
      'imageUrl' : 'https://pixnio.com/free-images/2017/03/17/2017-03-17-09-15-56.jpg',
      'price' : 1.75,
      'title' : 'Avacado'
    },
    {
      'categoryValue' : 'vegetables',
      'categoryId' : 'CyMygC0vFNBLXPvt0xez',
      'imageUrl' : 'https://static.pexels.com/photos/8390/food-wood-tomatoes.jpg',
      'price' : 2.5,
      'title' : 'Tomato'
    },
    {
      'categoryValue' : 'vegetables',
      'categoryId' : 'CyMygC0vFNBLXPvt0xez',
      'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Lettuce_Mini_Heads_%287331119710%29.jpg',
      'price' : 1,
      'title' : 'Lettuce'
    },
    {
      'categoryValue' : 'vegetables',
      'categoryId' : 'CyMygC0vFNBLXPvt0xez',
      'imageUrl' :
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Cauliflowers_-_20051021.jpg/1280px-Cauliflowers_-_20051021.jpg',
      'price' : 1.75,
      'title' : 'Cauliflower'
    },
    {
      'categoryValue' : 'fruits',
      'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
      'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Bananas.jpg/1024px-Bananas.jpg',
      'price' : 1.25,
      'title' : 'Banana'
    },
    {
      'categoryValue' : 'fruits',
      'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
      'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg',
      'price' : 1.7,
      'title' : 'Orange'
    },
    {
      'categoryValue' : 'fruits',
      'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
      'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg',
      'price' : 2,
      'title' : 'Apple'
    },
    {
      'categoryValue' : 'fruits',
      'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
      'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/3/36/Kyoho-grape.jpg',
      'price' : 2,
      'title' : 'Grape'
    },
    {
      'categoryValue' : 'fruits',
      'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
      'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Autumn_Red_peaches.jpg',
      'price' : 2,
      'title' : 'Peach'
    },
    {
      'categoryValue' : 'seasonings',
      'categoryId' : 'ucGTyQ6XXNh04zPEG42L',
      'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cinnamon-other.jpg',
      'price' : 0.5,
      'title' : 'Cinnamon Sticks'
    },
    {
      'categoryValue' : 'seasonings',
      'categoryId' : 'ucGTyQ6XXNh04zPEG42L',
      'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/4/48/Saffron_Crop.JPG',
      'price' : 3,
      'title' : 'Saffron'
    },
    {
      'categoryValue' : 'seasonings',
      'categoryId' : 'ucGTyQ6XXNh04zPEG42L',
      'imageUrl' : 'http://maxpixel.freegreatpicture.com/static/photo/1x/Seasoning-Powder-Curry-Spice-Ingredient-Turmeric-2344157.jpg',
      'price' : 0.75,
      'title' : 'Ground Turmeric'
    },
    {
      'categoryValue' : 'seasonings',
      'categoryId' : 'ucGTyQ6XXNh04zPEG42L',
      'imageUrl' : 'http://maxpixel.freegreatpicture.com/static/photo/1x/Ingredient-Herb-Seasoning-Seeds-Food-Coriander-390015.jpg',
      'price' : 0.5,
      'title' : 'Coriander Seeds'
    },
    {
      'categoryValue' : 'bread',
      'categoryId' : 'nAkIDHxy4LjrxvUutb6f',
      'imageUrl' :
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/' +
      'Fabrication_du_lavash_%C3%A0_Noravank_%286%29.jpg/1280px-Fabrication_du_lavash_%C3%A0_Noravank_%286%29.jpg',
      'price' : 1.25,
      'title' : 'Lavash Bread'
    },
    {
      'categoryValue' : 'bread',
      'categoryId' : 'nAkIDHxy4LjrxvUutb6f',
      'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Bagel-Plain-Alt.jpg',
      'price' : 1,
      'title' : 'Bagel Bread'
    },
    {
      'categoryValue' : 'fruits',
      'categoryId' : 'YCK7k2dbqt4jMHg2xCcI',
      'imageUrl' : 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Strawberries.jpg',
      'price' : 1.95,
      'title' : 'Strawberry'
    },
    {
      'categoryValue' : 'bread',
      'categoryId' : 'nAkIDHxy4LjrxvUutb6f',
      'imageUrl' : 'https://static.pexels.com/photos/416607/pexels-photo-416607.jpeg',
      'price' : 1.25,
      'title' : 'Baguette Bread'
    }
  ];

  private listWithIds: Product[];

  constructor(private afs: AngularFirestore) { }

  launchImport() {
    this.populateList();
    console.log('list populated', this.listWithIds);
  }

  // Batch import to database
  private populateList() {

    // Optionally add new IDs to items
    this.addIdToItems();

    const batch = this.afs.firestore.batch();
    const dataCollection = this.afs.collection<Product>('products');

    if (this.listWithIds) {
      this.listWithIds.map(item => {
        const itemRef = dataCollection.ref.doc(item.productId);
        batch.set(itemRef, item, {merge: true});
      });
    } else {
      this.dataList.map(item => {
        const itemRef = dataCollection.ref.doc(item.productId);
        batch.set(itemRef, item, {merge: true});
      });
      this.listWithIds = this.dataList;
    }

    batch.commit();
  }

  // Assign atuo ids to list items
  private addIdToItems(): void {
    this.listWithIds = this.dataList.map(item => {
      const autoId = this.afs.createId();
      const itemWithId: Product = {
        productId: autoId,
        title: item.title,
        price: item.price,
        categoryValue: item.categoryValue,
        categoryId: item.categoryId,
        imageUrl: item.imageUrl
      };
      return itemWithId;
    });
  }
}

