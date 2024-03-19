<!-- eslint-disable vue/no-unused-vars -->
<!-- 预约管理，只需要状态 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 标题 -->
      <el-input v-model="ppname" placeholder="请输入患者姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="getListByName" />
      <!-- 搜索按钮 -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getListByName">
        搜索
      </el-button>
      <!-- 添加按钮 -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!-- 病历号 -->
      <el-table-column label="病历号" prop="mrno" align="center" width="80">
        <!-- <template slot-scope="{row}">
          <span>{{ row.MRno }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="患者号" prop="pno" align="center" width="80">
        <!-- <template slot-scope="{row}">
          <span>{{ row.Pno }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="患者姓名" prop="patient.pname" align="center" width="80">
        <!-- <template slot-scope="{row}">
          <span>{{ row.Pno }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="患者电话" prop="patient.pphone" align="center" width="80">
        <!-- <template slot-scope="{row}">
          <span>{{ row.Pno }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="医生号" prop="dno" align="center" width="80">
        <!-- <template slot-scope="{row}">
          <span>{{ row.Dno }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="医生姓名" prop="doctor.dname" align="center" width="80">
        <!-- <template slot-scope="{row}">
          <span>{{ row.Dno }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="疾病" prop="disease" align="center" width="120">
        <!-- <template slot-scope="{row}">
          <span>{{ row.Disease }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="上次修改时间" prop="updateDate" align="center" width="120">
        <!-- <template slot-scope="{row}">
          <span>{{ row.Disease }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="治疗过程" prop="treatment" align="center" width="220">
        <!-- <template slot-scope="{row}">
          <span>{{ row.Treatment }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="治疗结果" prop="result" align="center" width="130">
        <!-- <template slot-scope="{row}">
          <span>{{ row.Result }}</span>
        </template> -->
      </el-table-column>

      <!-- <el-table-column :label="$t('table.title')" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column> -->
      <!-- 作者
      <el-table-column :label="$t('table.author')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
       重要性
      <el-table-column :label="$t('table.importance')" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in +row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
       状态
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <!-- <template slot-scope="{row,$index}"> -->
        <!-- 编辑  -->
        <template scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button v-show="show" type="danger" size="mini" @click="deleteMr(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
        <!-- 发布 要修改为确认
          <el-button v-if="row.status!='0'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            确认
          </el-button> -->
        <!-- 草稿 要改为完成就医 -->
        <!-- <el-button v-if="row.status!='1'" size="mini" @click="handleModifyStatus(row,'draft')">
            完成
          </el-button> -->
        <!-- 删除 要改为提交状态 -->
        <!-- <el-button v-if="row.status!='2'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button> -->
        <!-- </template> -->
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <!-- 弹窗组件 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="mrs" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="病历号" prop="mrno">
          <el-input v-model="mrs.mrno" :disabled="disabled" />
        </el-form-item>

        <el-form-item label="患者号" prop="pno">
          <el-input v-model="mrs.pno" :disabled="disabled" />
        </el-form-item>

        <el-form-item label="疾病名称" prop="disease">
          <el-input v-model="mrs.disease" />
        </el-form-item>

        <el-form-item label="治疗过程" />
        <el-input v-model="mrs.treatment" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />

        <el-form-item label="治疗结果" />
        <el-input v-model="mrs.result" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />

        <!-- <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select> -->
        <!-- </el-form-item> -->

        <!-- 星星 -->
        <!-- <el-form-item label="治疗结果">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item> -->
        <!-- <el-form-item label="$t('table.remark')">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
// import { fetchList, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
// import { timingSafeEqual } from 'crypto'
import moment from 'moment'
import { deleteByMRno } from '@/api/Mrs'
// import { DDno } from '@/store/modules/user'
// const calendarTypeOptions = [
//   { key: 'CN', display_name: 'China' },
//   { key: 'US', display_name: 'USA' },
//   { key: 'JP', display_name: 'Japan' },
//   { key: 'EU', display_name: 'Eurozone' }
// ]

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  name: 'ComplexTable',
  // components: { Pagination },
  directives: { waves },
  data() {
    return {
      // list: [{
      //   id: 1,
      //   time: '1998-07-06 11:04'
      // }],
      show: false,
      readonly: true,
      disabled: false,
      ppname: '',
      list: [],
      newlist: [],
      tableKey: 0,
      total: 0,
      listLoading: true,
      // listQuery: {
      //   page: 1,
      //   limit: 20,
      //   MR: this.MRno,
      //   update_Date: new Date(),
      //   Disease: '',
      //   Result: '',
      //   Treatment: '',
      //   sort: '+id'
      // },
      statusOptions: [0, 1, 2],
      // importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      showReviewer: false,

      Dno: '',
      // 新增的默认状态
      mrs: {
        mrno: '',
        dno: this.Dno,
        pno: '',
        disease: '',
        result: '治疗中',
        treatment: '治疗过程',
        createdate: '2023-04-12',
        updatedate: '2023-04-12'
      },
      // 更新弹框状态
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改病历',
        create: '新增病历'
      },
      // 新增弹框状态
      dialogPvVisible: false,
      pvData: [],
      // 弹框内容的规则,比如类型,是否非空
      rules: {
        MRno: [{ required: true, message: 'type is required', trigger: 'change' }]
        // Pno: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.Dno = window.localStorage.getItem('DDno')
    if (this.Dno === 'admin') { this.show = true }
    this.getList()
    this.listLoading = false
    console.log(this)
  },
  methods: {
    getListByName() {
      this.listLoading = true
      console.log(this.ppname)
      this.newList = []
      if (this.ppname !== '' && this.list) {
        this.list.forEach(item => {
          if (item.patient.pname === this.ppname) {
            console.log(item)
            this.newList.push(item)
          }
        })
        this.list = this.newList

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      } else { this.getList() }
    },
    getList() {
      this.listLoading = true
      this.$http.get('/mr/selectMr_P_DByDno?Dno=' + this.Dno).then((response) => {
        this.list = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      console.log(this.Dno)
    },
    resetTemp() {
      this.mrs = {
        mrno: '',
        pno: '',
        dno: this.Dno,
        // update_Date: new Date(),
        disease: '',
        result: '治疗结果',
        treatment: '治疗过程'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.disabled = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.mrs)
          this.mrs.createDate = moment().format('YYYY-MM-DD')
          this.mrs.updateDate = moment().format('YYYY-MM-DD')
          console.log(this.mrs)
          this.$http.post('/mr/insert', this.mrs).then((response) => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              position: 'bottom-right',
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(index, mrs) {
      this.mrs = Object.assign({}, mrs) // copy obj
      this.disabled = true
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.mrs)
          this.mrs.updateData = moment().format('YYYY-MM-DD')
          this.$http.post('/mr/update', this.mrs).then((response) => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              position: 'bottom-right',
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    deleteMr(index, row) {
      console.log(row)
      deleteByMRno(row.mrno).then((response) => {
        this.$notify({
          position: 'bottom-right',
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        // 注意作用域问题,加=>和父级作用域相同,去掉function
      })
      this.listLoading = true
      this.getList()
      this.listLoading = false
    }
    // handleDelete(row, index) {
    //   this.$notify({
    //     title: '成功',
    //     message: '删除成功',
    //     type: 'success',
    //     duration: 2000
    //   })
    //   this.list.splice(index, 1)
    // },
    // 排序方法
    // getSortClass: function(key) {
    //   const sort = this.listQuery.sort
    //   return sort === `+${key}` ? 'ascending' : 'descending'
    // }
  }
}
</script>
<style>
.filter-container{
  padding-bottom: 1%;

}
.filter-container .el-input{
  padding-right: 1%;
  }
</style>
