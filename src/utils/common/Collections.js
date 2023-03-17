class Collection {
    constructor(data = {}) {
        this.data = data
    }

    setData(data) { this.data = data }
    getData() { return this.data }

    toArrayByValue(data) { return Object.values(data) }
    toArrayByKey(data) { return Object.keys(data) }

    parseJson(data) { return JSON.parse(data) }
    stringify(data) { return JSON.stringify(data) }

    toSet(data = {}) { return new Set(data) }

    isEmpty(data) {
        if (typeof data === 'object') {
            return Object.keys(data).length === 0
        }
        return false
    }

}

export default Collection;