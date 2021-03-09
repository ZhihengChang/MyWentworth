/**
 * DBAPI class
 * 
 * description: 
 * this class addes handling to filtering, sorting, fields limitation, and pagination in req.query
 * 
 * used by: * controllers
 * 
 * usage: 
 *   let result = new DBAPI(model.find(), req.query).feature();
 * 
 * feature functions: (process the url query to proper format)
 *   filter():      delete fields name and adding $ sign to >|>=|<|<=, and find() based on the filter
 *   sort():        delete , and add ' ' in between each sortby fields, and sort() based on sortbys
 *   limitFields(): delete , and add ' ' in between each limit fields, and select() based on limit fields
 *   pagination():  limit the number of documents returned using skip(documents#).limit(documents#)
 * 
 * NOTE: DBAPI supports function chaining, for example:
 *   let result = new DBAPI(model.find(), req.query).feature1().feature2().feature3().feature4();
 */
class DBAPI {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    } 

    /**
     * process filtering in url query
     * @returns DBAPI
     */
    filter() {
        const queryObj = {...this.queryString};
        const excludedFieds = ['page', 'sort', 'limit', 'fields'];
        excludedFieds.forEach(el => delete queryObj[el]);
        
        let queryStr = JSON.stringify(queryObj).replace(
            /\b(gte|gt|lte|lt)\b/g, match => `$${match}`
        );
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    /**
     * process sorting in url query
     * by default all documents are sorted by [edit field name here]
     * NOTE: adding '-' sign in front of a field is sorting in des order
     * @returns DBAPI
     */
    sort() {
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)
        }else{
            // edit here for default sortby
            // this.query = this.query.sort(field name);
        }
        return this;
    }

    /**
     * process fields limitation in url query
     * by default add documents exclude field name '__v' used by mongodb internally
     * @returns DBAPI
     */
    limitFields() {
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
        }
        return this;
    }

    /**
     * process pagination in url query
     * by default each page contains 100 documents
     * @returns DBAPI
     */
    paginate() {
        const page = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = DBAPI;