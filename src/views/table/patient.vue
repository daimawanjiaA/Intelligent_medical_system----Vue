<template>
  <div>
    <div class="filter-container_p">
      <!-- 标题 -->
      <el-input
        v-model="ppname"
        placeholder="请输入患者姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getListByName"
      />
      <!-- 搜索按钮 -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getListByName">
        搜索
      </el-button>
      <!-- 添加按钮 -->
      <el-button
        v-show="show"
        class="filter-item"
        style="margin-left: 30px; margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      class="p_table"
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      :cell-style="tableCellStyle"
      :header-cell-style="tableHeaderCellStyle"
    >
      <el-table-column prop="pno" align="center" label="患者编号" width="180" />
      <el-table-column prop="pname" align="center" label="患者姓名" width="180" />
      <el-table-column prop="pphone" align="center" label="患者电话" />
      <el-table-column v-if="visible" prop="pwd" align="center" label="密码" />
      <el-table-column prop="oname" align="center" label="患者近期就诊科室" />
      <el-table-column prop="beiZhu" align="center" width="180" label="备注" />
      <el-table-column prop="time" align="center" label="注册时间" />
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <!-- <template slot-scope="{row,$index}"> -->
        <!-- 编辑  -->
        <template scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button v-show="show" type="danger" size="mini" @click="deletePatient(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗组件 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="patients"
        label-position="left"
        label-width="80px"
        style="width: 350px; margin-left:50px;"
      >
        <el-form-item label="病人号" prop="pno">
          <el-input v-model="patients.pno" :disabled="disabled" />
        </el-form-item>

        <el-form-item label="病人姓名" prop="pname">
          <el-input v-model="patients.pname" :disabled="disabled" />
        </el-form-item>

        <el-form-item label="就诊科室" prop="disease">
          <el-input v-model="patients.oname" />
        </el-form-item>

        <el-form-item label="联系电话" prop="disease">
          <el-input v-model="patients.pphone" />
        </el-form-item>

        <el-form-item label="备注" />
        <el-input
          v-model="patients.beiZhu"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="Please input"
        />

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
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteByPno, fetchList, fetchByName, createPatient, updatePatient } from '@/api/patient'
import waves from '@/directive/waves'
import moment from 'moment'
export default {
  directives: { waves },
  data() {
    return {
      DDno: '',
      show: false,
      patients: {
        pno: '',
        pname: '',
        oname: '',
        time: '',
        pwd: '',
        pphone: '',
        beiZhu: '请填写病人最近状态'
      },
      // 更新弹框状态
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改患者信息',
        create: '新增患者'
      },
      rules: {
        pno: [{ required: true, message: 'type is required', trigger: 'change' }],
        pname: [{ required: true, message: 'type is required', trigger: 'blur' }],
        pphone: [{ required: true, message: 'type is required', trigger: 'blur' }],
        oname: [{ required: true, message: 'type is required', trigger: 'blur' }]
        // Pno: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      disabled: false,
      visible: false,
      ppname: '',
      listLoading: true,
      tableData: []
    }
  },
  created() {
    this.Dno = window.localStorage.getItem('DDno')
    console.log(this.Dno)
    if (this.Dno === 'admin') {
      this.visible = true
      this.show = true
    }
    this.getList()
    this.listLoading = false
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      } else { return 'success-row' }
    },
    getList() {
      // this.$http.get('/patient/findAll').then((response) => {
      fetchList().then((response) => {
        // console.log(response)
        this.tableData = response.data
        // console.log(this.tableData)
        // 注意作用域问题,加=>和父级作用域相同,去掉function
      })
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    getListByName() {
      if (this.ppname !== '') {
        fetchByName(this.ppname).then((response) => {
          // console.log(this.ppname)
          // console.log(response.data)
          this.listLoading = true
          this.tableData = response.data
        })

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      } else { this.getList() }
    },
    resetTemp() {
      this.patients = {
        pno: '',
        pname: '',
        oname: '',
        time: '',
        pwd: '123456',
        pphone: 'XXX-XXX',
        beiZhu: '请填写病人最近状态'
      }
    },
    handleUpdate(intdex, row) {
      this.patients = Object.assign({}, row)
      this.disabled = true
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
          this.patients.time = moment().format('YYYY-MM-DD')
          this.patients.pwd = '123123'
          console.log(this.patients)
          // this.$http.post('/patient/insert', this.patients).then((response) => {
          createPatient(this.patients).then((response) => {
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.patients)
          // this.mrs.updateData = moment().format('YYYY-MM-DD')
          updatePatient(this.patients).then((response) => {
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
    deletePatient(index, row) {
      console.log(row)
      deleteByPno(row.pno).then((response) => {
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
    },
    // 修改 table cell边框的背景色
    tableCellStyle() {
      // return 'border-color: #868686;'
    },
    // 修改 table header cell的背景色
    tableHeaderCellStyle() {
      return 'border-top:solid 1px #d2d3da;;border-bottom:solid 1px #d2d3da;'
      // return 'border-color: #868686; color: #606266;
    }

  }
}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.filter-container_p {
  padding-top: 1%;
}

.filter-container_p {
  padding-bottom: 1%;
  padding-left: 3%;
}

.filter-container_p .el-input {
  padding-right: 1%;
}
</style>

