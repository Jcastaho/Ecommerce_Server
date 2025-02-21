import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import async_foreach = require('../utils/async_foreach');
import storage = require('../utils/cloud_storage');


@Injectable()
export class ProductsService {


    constructor(@InjectRepository(Product) private productsRepository: Repository<Product>) { }

    findAll() {
        return this.productsRepository.find();
    }

    findByCategory(id_category: number) {
        return this.productsRepository.findBy({ id_category: id_category });
    }

    async create(files: Array<Express.Multer.File>, product: CreateProductDto) {

        if (files.length === 0) {
            throw new HttpException("Las imagenes son obligatorias", HttpStatus.NOT_FOUND)
        }

        let uploadedFiles = 0; // cuantos archivos se han subo a firebase

        const newProduct = this.productsRepository.create(product);
        const savedProduct = await this.productsRepository.save(newProduct)

        const startForEach = async () => {
            await async_foreach(files, async (file: Express.Multer.File) => {
                const url = await storage(file, file.originalname);

                if (url !== undefined && url !== null) {
                    if (uploadedFiles === 0) {
                        savedProduct.image1 = url
                    }
                    else if (uploadedFiles === 1) {
                        savedProduct.image2 = url
                    }
                }
                await this.update(savedProduct.id, savedProduct);
                uploadedFiles = uploadedFiles + 1;

            })
        }
        await startForEach()
        return savedProduct
    }

    async updateWithImages(files: Array<Express.Multer.File>, id: number, product: UpdateProductDto) {

        if (files.length === 0) {
            throw new HttpException("Las imagenes son obligatorias", HttpStatus.NOT_FOUND)
        }

        let counter = 0;
        let uploadedFiles = Number((product.images_to_update ?? [])[counter]); // cuantos archivos se han subo a firebase


        const updatedProduct = await this.update(id, product);

        const startForEach = async () => {
            await async_foreach(files, async (file: Express.Multer.File) => {
                const url = await storage(file, file.originalname);

                if (url !== undefined && url !== null) {
                    if (uploadedFiles === 0) {
                        updatedProduct.image1 = url
                    }
                    else if (uploadedFiles === 1) {
                        updatedProduct.image2 = url
                    }
                }
                await this.update(updatedProduct.id, updatedProduct);
                counter++
                uploadedFiles = Number((product.images_to_update ?? [])[counter]);

            })
        }
        await startForEach()
        return updatedProduct;
    }



    async update(id: number, product: UpdateProductDto) {
        const productFound = await this.productsRepository.findOneBy({ id: id });
        if (!productFound) {
            throw new HttpException("Producto no encontrado", HttpStatus.NOT_FOUND)
        }
        const sanitizedProduct = { ...product };
        if (sanitizedProduct.image1 === '') {
            delete sanitizedProduct.image1;
        }
        if (sanitizedProduct.image2 === '') {
            delete sanitizedProduct.image2;
        }
        const updateProduct = Object.assign(productFound, sanitizedProduct);
        return this.productsRepository.save(updateProduct)
    }

    async delete(id: number) {
        const productFound = await this.productsRepository.findOneBy({ id: id });
        if (!productFound) {
            throw new HttpException("Producto no encontrado", HttpStatus.NOT_FOUND)
        }
        return this.productsRepository.delete(id)
    }

}
