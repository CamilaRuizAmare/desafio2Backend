const fs = require('fs');

class ProductManager {
    constructor() {
        this.path = 'Products.json';
    };

    async writeFile(products) {
        await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
    };

    async readFile() {
        try {
            const infoProduct = await fs.promises.readFile(this.path);
            const products = JSON.parse(infoProduct);
            return products;
        }
        catch (error) {
            return [];
        }
    };

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            const file = await this.readFile();
            const id = file.length === 0 ? file.length + 1 : file[file.length - 1].id + 1;
            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                id
            };
            const codeValidation = file.find(data => data.code === code);
            const productValidation = product.title != '' && product.description != '' && product.price != '' && product.thumbnail != '' && product.code != '' && product.stock != ''
            if (!codeValidation && productValidation) {
                file.push(product);
                await this.writeFile(file);
                return 'Producto cargado';
            }
            else {
                return `El producto con código ${product.code} ya fue ingresado`
            }
        }
        catch (error) {
            console.error(error);
        };
    };

    async getProducts() {
        try {
            const products = await this.readFile();
            return products;
        }
        catch (error) {
            console.error('Error al procesar el archivo', error);
        }
    };

    async getProductById(id) {
        try {
            const products = await this.readFile();
            const idProduct = products.find(product => product.id === id);
            if (idProduct) {
                return idProduct;
            }
            else {
                return 'El producto no se ha encontrado';
            };
        }
        catch (error) {
            console.error('Error al procesar la solicitud', error);
        }
    };

    async updateProduct(id, newProduct) {
        try {
            const products = await this.readFile();
            const productIndex = products.findIndex(product => product.id === id);
            if (productIndex !== -1) {
                const updatedProduct = {
                    ...products[productIndex],
                    ...newProduct
                };
                products[productIndex] = updatedProduct;
                await this.writeFile(products);
                return 'Producto actualizado';
            } else {
                return 'Producto no encontrado';
            }
        } catch (error) {
            console.error(error);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.readFile();
            const productIndex = products.findIndex(product => product.id === id);
            if (productIndex !== -1) {
                products.splice(productIndex, 1);
                await this.writeFile(products);
                return 'Producto eliminado';
            }
            else {
                return 'Producto no encontrado';
            }
        }
        catch (error) {
            console.error('Error al procesar la solicitud', error);
        }
    }


};

const productManager = new ProductManager();
const runProgram = async () => {
    console.log(await productManager.getProducts()); 
    console.log(await productManager.addProduct('Producto prueba22', 'Este es un pro22ducto prueba', 200,  'Sin imagen', 'abc123', 25));
    console.log(await productManager.getProducts()); 
    console.log(await productManager.getProductById(1));
    console.log(await productManager.getProductById(3));
    console.log(await productManager.updateProduct(1, {price: 7500, description: 'Se modifica la descripción del producto'}));
    console.log(await productManager.deleteProduct(1));
    console.log(await productManager.deleteProduct(8));
};

runProgram();
