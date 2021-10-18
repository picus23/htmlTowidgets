
class HTW {
    static opentag = '##>>'
    static closetag = '<<##'
    static n = '**nline**'

    html = ''
    tags = []
    tagRoad = [{
        level: 0,
        position: 1
    }]

    toString(){
        return this.html
    }

    constructor(html){
        this.html = html
    }

    static true_elements = [
        "area", "base", "br", 
        "col", "embed", "hr", 
        "img", "input", "link", 
        "menuitem", "meta", "param", 
        "source", "track", "wbr"
    ]

    static convert(html){
        return new HTW(html)
            .replaceTags()
            .wrapContent()
    }

    /**
     * Обработка контентной части
     */
    wrapContent(){
        this.getComplexity()
        // this.removetags()
        return this
    }

    getTagRoad(){
        const getallpreg = new RegExp("("+ HTW.opentag + "|" + HTW.closetag +")", 'gms')
        let start = 0
        let level = 0
        while (true){
            const bodyposition = this.html.substr(start).search(getallpreg)
            start += bodyposition
            if (bodyposition==-1) break

            if (this.html.substr(start, HTW.opentag.length)==HTW.opentag){
                level++
            } else {
                level--
            }

            this.tagRoad.push({
                level,
                position: start
            })

            start+=4
        }
    }

    /**
     * Расчитать вложенность
     */
    getComplexity(){
        this.getTagRoad()
        // console.log(this.tagRoad)

        let mapIndex = 0
        this.tags.map((tag, index) => {

            let mylvlIs = 0

            for (const level of this.tagRoad){
                if (tag.position>=level.position){
                    // this.tags[index].level = level.level
                    mylvlIs = level.level
                } else {
                    break
                }
            }

            tag.level = mylvlIs
        })


        console.log(this.tags)
    }


    /**
     * Удалить дополгнительные теги
     */
    removetags(html){
        this.html = this.html.replaceAll(HTW.opentag, '')
                            .replaceAll(HTW.closetag, '')
    }


    /**
     * Замена первого тега
     */
    replaceTags(){
        this.relaceEndTag()
        const searchtag = /<[a-zA-Z].*?>/gms
        while (true){
            const tagPlace = this.html.search(searchtag)
            if (tagPlace==-1) break;
            const tagElement = this.html.match(searchtag)[0]
            let tag = tagElement.match(/<(.*?)[ |>]/)[1]
            const classes = HTW.upClasses(HTW.parseClass(tagElement))
            if (classes!='')
                tag += '__' + classes
            
            this.html = this.html.slice(0, tagPlace) + `c.${tag}(` + HTW.opentag
            + ((HTW.true_elements.indexOf(tag)!=-1)?HTW.closetag + ')':'')
            + this.html.slice(tagPlace + tagElement.length)
        
            this.tags.push(
                {
                    tag,
                    position: tagPlace,
                    element: tagElement
                }
            )
        }

        return this
    }

    /**
     * Замена последнего тега
     * @param {*} html 
     */
    relaceEndTag(){
        this.html = this.html.replaceAll(/<\/.*>/gi, HTW.closetag+')')

        return this
    }

    static parseClass(element){
        return element.match(/class=["|'](.*?)["|']/)
    }

    static upClasses(classes){
        if (classes && classes.length>1){

            let wclass = ''
            let upcase = false
            let addSpace = false
            classes[1].trim().split('').map(char => {
                
                if (char==' '){
                    if (addSpace==false)
                        char = '$'
                    else
                        char = ''
                        
                    addSpace = true
                } else {
                    addSpace = false
                }

                if (upcase){
                    upcase = false
                    if (char.toUpperCase()==char)
                        wclass += '$$'
                    char = char.toUpperCase()
                }
                

                if (char=='-') 
                    upcase=true
                else
                    wclass += char

            })

            return wclass
        } else
            return ''
    }
}