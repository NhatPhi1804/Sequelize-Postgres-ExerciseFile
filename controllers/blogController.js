const controller = {};
const { where } = require("sequelize");
const models = require("../models");
const limit = 2;

function reProcessData(datas) {
    // Only get the dataValues from each datas
    let newData = datas.map((data) => data.dataValues);
    return newData;
}

controller.show = async (req, res) =>{

    res.locals.categories = await models.Category.findAll({
    attributes: ["id", "name"],
    include: [{model: models.Blog}],
    })

    res.locals.tags = await models.Tag.findAll({
        attributes: ["id", "name"],
        include: [{model: models.Blog}]
    })
    let tagQuery = req.query.tag;
    let categoryQuery = req.query.category;
    let searchQuery = req.query.searchInput;
    let curPage = Number(req.query.page) || 1;
    var pagination = {};

    
    if(tagQuery){
        // res.locals.blogs = await models.Blog.findAll({
        //     attributes: ['id', 'title', 'imagePath', 'summary', 'createdAt'],
        //     include: [
        //         { model: models.Tag, where: {id: tagQuery}},
        //         { model: models.Comment }
        //     ]
        // });
        let { count, rows: blogs } = await models.Blog.findAndCountAll({
            limit: limit,
            offset: (curPage - 1) * limit,
            attributes: [
                "id",
                "title",
                "imagePath",
                "summary",
                "createdAt",
                "categoryId",
                [
                    models.Sequelize.literal(
                        '(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."blogId" = "Blog"."id")'
                ), "comments",
            ],
        ],
        include:[{model: models.Tag, where: {id: tagQuery}}],
        })
        console.log(blogs);
        res.render("index", {
            blogs: reProcessData(blogs),
            pagination: {
                page: curPage,
                limit: limit,
                totalRows: count,
                queryParams: {tag: tagQuery},
            },
        })
    }
    else if(categoryQuery){
        // res.locals.blogs = await models.Blog.findAll({
        //     attributes: ['id', 'title', 'imagePath', 'summary', 'createdAt', 'categoryId'],
        //     include: [
        //         {model: models.Comment}
        //     ],
        //     where: [{categoryId: categoryQuery}] 
        // });
        let { count, rows: blogs } = await models.Blog.findAndCountAll({
            limit: limit,
            offset: (curPage - 1) * limit,
            attributes: [
                "id",
                "title",
                "imagePath",
                "summary",
                "createdAt",
                "categoryId",
                [
                    models.Sequelize.literal(
                        '(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."blogId" = "Blog"."id")'
                ), "comments",
            ],
        ],
        where: {categoryId: categoryQuery},
        })
        console.log(blogs);
        res.render("index", {
            blogs: reProcessData(blogs),
            pagination: {
                page: curPage,
                limit: limit,
                totalRows: count,
                queryParams: {category: categoryQuery},
            },
        })
    }
    else if(searchQuery){
        // res.locals.blogs = await models.Blog.findAll({
        //     attributes: ['id', 'title', 'imagePath', 'summary', 'createdAt'],
        //     include: [{model: models.Comment}],
        //     where: [{title: {[models.Sequelize.Op.iLike] : `%${searchQuery}%`}}]
        // });
        let { count, rows: blogs } = await models.Blog.findAndCountAll({
            limit: limit,
            offset: (curPage - 1) * limit,
            attributes: [
                "id",
                "title",
                "imagePath",
                "summary",
                "createdAt",
                "categoryId",
                [
                    models.Sequelize.literal(
                        '(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."blogId" = "Blog"."id")'
                ), "comments",
            ],
        ],
        where: [{title: {[models.Sequelize.Op.iLike] : `%${searchQuery}%`}}],
        })
        console.log(blogs);
        res.render("index", {
            blogs: reProcessData(blogs),
            pagination: {
                page: curPage,
                limit: limit,
                totalRows: count,
                queryParams: {searchInput: searchQuery},
            },
        })
    }
    else{
        // res.locals.blogs = await models.Blog.findAll({
        //     attributes: ['id', 'title', 'imagePath', 'summary', 'createdAt'],
        //     include: [{ model: models.Comment }],
        // });
        let { count, rows: blogs } = await models.Blog.findAndCountAll({
            limit: limit,
            offset: (curPage - 1) * limit,
            attributes: [
                "id",
                "title",
                "imagePath",
                "summary",
                "createdAt",
                "categoryId",
                [
                    models.Sequelize.literal(
                        '(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."blogId" = "Blog"."id")'
                ), "comments",
            ],
        ],
        })
        res.render("index", {
            blogs: reProcessData(blogs),
            pagination: {
                page: curPage,
                limit: limit,
                totalRows: count,
            },
        })

    }
}

controller.showDetails = async (req, res) =>{
    res.locals.categories = await models.Category.findAll({
        attributes: ["id", "name"],
        include: [{model: models.Blog}],
    })

    res.locals.tags = await models.Tag.findAll({
        attributes: ["id", "name"]
    })

    let id = isNaN(req.params.id) ? 0 : req.params.id;

    res.locals.blog = await models.Blog.findOne({
        attributes: ["id", "title", "description", "createdAt"],
        where: [{id: id}],
        include: [
            {model: models.Comment},
            {model: models.User},
            {model: models.Tag},
            {model: models.Category}
        ]
    });
    res.render('details');
}



module.exports = controller;