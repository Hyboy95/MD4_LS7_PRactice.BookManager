import { Book } from "../models/schemas/book.schemas";
import { Author } from "../models/schemas/author.schemas";

export class BookController {
    static async getCreatePage(req: any, res: any) {
        res.render("createBook");
    }

    static async addNewBook(req: any, res: any) {
        try {
            const bookNew = new Book({
                title: req.body.title,
                description: req.body.description,
            })
            let authorSearch = await Author.findOne({ name: req.body.author });
            if (!authorSearch) {
                authorSearch = new Author({
                    name: req.body.author
                })
            }
            bookNew.author = authorSearch;
            bookNew.keywords.push({ keyword: req.body.keyword });
            const p1 = authorSearch.save();
            const p2 = bookNew.save();
            let [author, book] = await Promise.all([p1, p2]);
            if (book) res.redirect('/');
            else res.render('error');
        } catch (err) {
            res.render(err.message);
        }
    }

    static async getListBook(req: any, res: any) {
        try {
            let size = 3;
            let page = req.query.page ? +req.query.page : 1;

            if (req.body.size) {
                size = +req.body.size;
            } else if (req.query.limit) {
                size = +req.query.limit;
            }
            let query = {};
            if (req.query.keyword && req.query.keyword !== "") {
                let keywordSearch = req.query.keyword || "";
                query = {
                    "keywords.keyword": { $regex: keywordSearch }
                }
            }
            if (req.query.author && req.query.author !== "") {
                let authordFind = req.query.author || "";
                let author = await Author.findOne({ name: { $regex: authordFind } })
                query = {
                    ...query,
                    author: author
                }
            }
            const allBook = await Book.find(query).populate({
                path: "author", select: "name"
            });
            let totalPage = Math.ceil(allBook.length / size);
            let offset = (page - 1) * size;
            const books = await Book.find(query).populate({
                path: "author", select: "name"
            }).limit(size).skip(offset);
            res.render("listBook", { books: books, totalPage: totalPage, pageCurrent: page, limit: size, totalItem: allBook.length });
        } catch (err) {
            res.render(err.message);
        }
    }

    static async getUpdatePage(req: any, res: any) {
        try {
            let { page, limit } = req.query;
            if (page && limit) {
                const book = await Book.findOne({ _id: req.params.id }).populate({
                    path: "author", select: "name"
                });
                if (book) {
                    res.render("updateBook", { book: book, pageCurrent: page, limit: limit })
                } else res.render('error');
            }
        } catch (err) {
            res.render(err.message);
        }
    }

    static async updateBook(req: any, res: any) {
        try {
            let { page, limit } = req.query;
            if (page && limit) {
                const book = await Book.findOne({ _id: req.params.id }).populate({
                    path: "author", select: "name"
                });
                // const authorUpdate = await Author.findOne({_id: book.author._id});
                // authorUpdate.name = req.body.author
                book.title = req.body.title;
                book.description = req.body.description;
                book.keywords[0].keyword = req.body.keyword;
                book.author.name = req.body.author;
                // await authorUpdate.save();
                await book.author.save();
                await book.save();
                if (book) res.redirect(`/?page=${page}&limit=${limit}`);
                else res.render('error');
            }
        } catch (err) {
            res.render(err.message);
        }
    }

    static async deleteBook(req: any, res: any) {
        try {
            let { page, limit } = req.query;
            if (page && limit && req.params.id) {
                // const book = await Book.findOne({_id:req.params.id});
                await Book.deleteOne({ _id: req.params.id });
                res.redirect(`/?page=${page}&limit=${limit}`)
            } else {
                res.render("error");
            }
        } catch (err) {
            res.render(err.message);
        }
    }
}