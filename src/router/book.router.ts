import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import multer from 'multer';
const upload = multer();
export const bookRoutes = Router();

bookRoutes.get('/create', BookController.getCreatePage);
bookRoutes.post('/create', upload.none(), BookController.addNewBook);
bookRoutes.get('/', BookController.getListBook);
bookRoutes.post('/', upload.none(), BookController.getListBook);
bookRoutes.get('/update/:id', BookController.getUpdatePage);
bookRoutes.post('/update/:id', upload.none(), BookController.updateBook);
bookRoutes.get('/delete/:id', BookController.deleteBook);
