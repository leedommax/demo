<template>
  <div>
    <p>
    <textarea id="data_area" cols="100" rows="10">[
        { "颜色": "红", "尺码": "大", "型号": "A", "skuId": "3158055" , "availableStockNumber":10 },
        { "颜色": "白", "尺码": "大", "型号": "A", "skuId": "3158054" , "availableStockNumber":20},
        { "颜色": "白", "尺码": "中", "型号": "B", "skuId": "3133859" , "availableStockNumber":30},
        { "颜色": "蓝", "尺码": "小", "型号": "C", "skuId": "3516833" , "availableStockNumber":0}
      ]</textarea>
    </p>
    <p>
      <input onclick="updateData()" type="button" value="更新数据">
    </p>

    <hr>

    <div id="app">
      <dl data-type="颜色" data-idx="0" v-for='(value, key) in showKeysMap'>
        <dt>{{key}}:</dt>
        <dd>
          <button @click="select(key,item,idx)" v-for="(item,idx) in value" :key=idx data-title="红" :class="{'active': item.active,'disabled': item.dis}" value="红">{{item.val}}</button>
        </dd>
      </dl>
    </div>

    <hr>

    <div id="msg">已选择：{{selectList}}库存：{{stock}}</div>
  </div>

</template>

<script>
export default {
  name: 'Sku',
  data () {
    return {
      spliter:'\u2299',
      // 原始
      originData:[
        { "颜色": "红", "尺码": "大", "型号": "A", "skuId": "3158055" , "availableStockNumber":10 },
        { "颜色": "白", "尺码": "大", "型号": "A", "skuId": "3158054" , "availableStockNumber":20},
        { "颜色": "白", "尺码": "中", "型号": "B", "skuId": "3133859" , "availableStockNumber":30},
        { "颜色": "蓝", "尺码": "小", "型号": "C", "skuId": "3516833" , "availableStockNumber":0}
      ],
      // 显示到页面上的属性
      showKeys:[],
      // 显示到页面属性值得集合
      showKeysMap:{},
      allGoodsKinds:[],
      // 所有选择情形的笛卡尔积
      allSelectPath:{},
      selectList: [],
      stock:0
    }
  },
  methods: {
    /*
    * 获取显示到页面属性名列表['颜色','尺码','型号']*/
    getShowkeys () {
      for (var attr_key in this.originData[0]) {
        if (!this.originData[0].hasOwnProperty(attr_key)) continue;
        if (attr_key != 'skuId' && attr_key != 'availableStockNumber') this.showKeys.push(attr_key)
      }
    },
    /*对原始数据进行拼装*/
    combineAttr () {
      // SKU PATH availableStockNumber {path: "红⊙大⊙A", sku: "3158055", availableStockNumber: 0}
      let allGoodsKinds=[];
      for (let i=0; i<this.originData.length;i++) {
        let values=[]
        let item = this.originData[i]
        for (let j=0; j<this.showKeys.length;j++) {
          let key = this.showKeys[j]
          values.push(item[key])
        }
        allGoodsKinds.push({
          path: values.join(this.spliter),
          skuId: item['skuId'],
          availableStockNumber: item['availableStockNumber']
        })
      }
      this.allGoodsKinds=allGoodsKinds
    },
    getShowKeysMap () {
      let showKeysMap={};
      let result={}
      for (let i=0; i<this.originData.length;i++) {
        let item = this.originData[i]
        for (let j=0; j<this.showKeys.length;j++) {
          let key = this.showKeys[j]
          if (!showKeysMap[key]) showKeysMap[key] = []
          if (showKeysMap[key].indexOf(item[key]) < 0) showKeysMap[key].push(item[key])
        }
      }
      for(let h in showKeysMap) {
        for(let y=0;y<showKeysMap[h].length;y++){
          // result[h].push({val:result[h][y],dis:false})
          if (!result[h]) result[h]=[]
          result[h].push({val:showKeysMap[h][y],dis:false,active:false})
        }
      }
      this.showKeysMap=result
    },
    // 生成所有子集是否可选、库存状态 map
    getAllSubMap () {
      let allPaths=this.getAllPath(this.allGoodsKinds)
      for (let i = 0; i < allPaths.length; i++) {
        let curr = allPaths[i]
        let sku = this.allGoodsKinds[i].skuId
        let availableStockNumber = this.allGoodsKinds[i].availableStockNumber
        let values = curr.split(this.spliter)
        // 获取每个path的所有子集
        let allSets = this.powerset(values)

        // 每个组合的子集
        for (let j = 0; j < allSets.length; j++) {
          let set = allSets[j]
          let key = set.join(this.spliter)

          if (this.allSelectPath[key]) {
            this.allSelectPath[key].skus.push({sku:sku,availableStockNumber:availableStockNumber})
          } else {
            this.allSelectPath[key] = {
              skus: [{sku:sku,availableStockNumber:availableStockNumber}]
            }
          }
        }
      }
    },
    // 获取所有属性组合的结合['蓝⊙小⊙C',"白⊙中⊙B",.....]
    getAllPath (arr) {
      var result = []
      for (var i = 0; i < arr.length; i++) { result.push(arr[i].path) }
      return result
    },
    // 获取一个数组的所有子集
    powerset (arr) {
      var ps = [[]];
      for (var i=0; i < arr.length; i++) {
        for (var j = 0, len = ps.length; j < len; j++) {
          ps.push(ps[j].concat(arr[i]));
        }
      }
      return ps;
    },
    select (key,item,index) {
      if(!item.active) {
        for(let i=0;i<this.showKeysMap[key].length;i++) {
          if(index==i) {
            this.showKeysMap[key][i].active=true
          }else{
            this.showKeysMap[key][i].active=false
          }
        }
        if (item.dis) {
          for (let key in this.showKeysMap) {
            for(let i=0;i<this.showKeysMap[key].length;i++) {
                this.showKeysMap[key][i].active=false
                this.showKeysMap[key][i].dis=false
            }
            item.active=true
          }
        } else {
        }
      }
      this.getSelectList()
    },
    getSelectList () {
      this.selectList=[]
      for(let key in this.showKeysMap) {
        let activeItem=this.showKeysMap[key].find((item) => {return item.active})
        if(activeItem) {
          this.selectList.push(activeItem.val)
        } else {
          this.selectList.push('')
        }
      }
      this.updateStatus()
    },
    // 更新状态
    updateStatus () {
      let stock = 0
      for(let i=0;i<this.showKeys.length;i++){
        let key = this.showKeys[i];
        let data = this.showKeysMap[key]
        let hasActive = !!this.selectList[i]
        let copy = this.selectList.slice()
        for (let j = 0; j < data.length; j++) {
          let item = data[j]
          if (this.selectList[i] == item.val) continue
          copy[i] = item.val
          let curr = this.trimSpliter(copy.join(this.spliter), this.spliter)
          if (this.allSelectPath[curr]) {
            this.showKeysMap[key][j].dis=false
          } else {
            this.showKeysMap[key][j].dis=true
          }
        }
      }
      var selectKey=this.trimSpliter(this.selectList.join(this.spliter), this.spliter)
      this.stock=0
      for (var q=0; q<this.allSelectPath[selectKey].skus.length; q++) {
        this.stock=this.stock+this.allSelectPath[selectKey].skus[q].availableStockNumber
      }
    },
    trimSpliter(str, spliter) {
      // ⊙abc⊙ => abc
      // ⊙a⊙⊙b⊙c⊙ => a⊙b⊙c
      var reLeft        = new RegExp('^' + spliter + '+', 'g');
      var reRight       = new RegExp(spliter + '+$', 'g');
      var reSpliter = new RegExp(spliter + '+', 'g');
      return str.replace(reLeft, '')
      .replace(reRight, '')
      .replace(reSpliter, spliter)
    }
  },
  created () {
    this.getShowkeys()
    this.getShowKeysMap()
    this.combineAttr()
    this.getAllSubMap()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  body {
    font-size: 12px;
  }
  dt {
    width: 100px;
    text-align: right;
  }
  dl {
    clear: both;
    overflow:hidden;
  }
  dl.hl {
    background:#ddd;
  }
  dt, dd {
    float:left;
    height: 40px;
    line-height: 40px;
    margin-left: 10px;
  }
  button {
    font-size: 14px;
    font-weight: bold;
    padding: 4px 4px;
  }
  .disabled {
    color:#999;
    border: 1px dashed #666;
  }
  .active {
    color: red;
  }
</style>
