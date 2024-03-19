<template>
  <div>
    <div class="filter-container_d">
      <!-- 标题 -->
      <el-input v-model="ddname" placeholder="请输入患者姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="getListByName" />
      <!-- 搜索按钮 -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getListByName">
        搜索
      </el-button>
      <!-- 添加按钮 -->
      <el-button class="filter-item" style="margin-left: 30px; margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName" :header-cell-style="tableHeaderCellStyle">
      <el-table-column prop="dno" align="center" label="医生编号" width="180" />
      <el-table-column prop="dname" align="center" label="医生姓名" width="180" />
      <el-table-column prop="dphone" align="center" label="联系电话" />
      <el-table-column prop="pwd" align="center" label="密码" />
      <el-table-column prop="oname" align="center" label="所属科室" />
      <el-table-column prop="joinDate" align="center" label="入职时间" />
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <!-- <template slot-scope="{row,$index}"> -->
        <template scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.$index, scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗组件 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="doctor" label-position="left" label-width="80px" style="width: 350px; margin-left:50px;">
        <el-form-item label="医生编号" prop="dno">
          <el-input v-model="doctor.dno" :disabled="disabled" />
        </el-form-item>

        <el-form-item label="医生姓名" prop="dname">
          <el-input v-model="doctor.dname" />
        </el-form-item>

        <el-form-item label="所属科室" prop="oname">
          <el-input v-model="doctor.oname" />
        </el-form-item>

        <el-form-item label="联系电话" prop="dphone">
          <el-input v-model="doctor.dphone" />
        </el-form-item>

        <el-form-item label="密码" prop="pwd">
          <el-input v-model="doctor.pwd" />
        </el-form-item>

        <el-form-item label="入职时间" prop="joinDate">
          <el-input v-model="doctor.joinDate" />
        </el-form-item>

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
  </div>
</template>

<script>
import { fetchByName, createDoctor, updateDoctor } from '@/api/doctor'
import waves from '@/directive/waves'
import moment from 'moment'

export default {
  directives: { waves },
  data() {
    return {
      tableData: [],
      doctor: {
        dno: '',
        dname: '',
        pwd: '',
        oname: '',
        dphone: '',
        joinDate: ''
      },
      // 更新弹框状态
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改医生信息',
        create: '新增医生'
      },
      rules: {
        dno: [{ required: true, message: 'type is required', trigger: 'change' }],
        dname: [{ required: true, message: 'type is required', trigger: 'blur' }],
        pwd: [{ required: true, message: 'type is required', trigger: 'change' }],
        oname: [{ required: true, message: 'type is required', trigger: 'blur' }],
        dphone: [{ required: true, message: 'type is required', trigger: 'blur' }]
        // Pno: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      disabled: false,
      listLoading: true,
      ddname: ''

    }
  },
  created: function() {
    this.listLoading = true
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
      this.$http.get('/doctor/findAll').then((response) => {
        console.log(response)
        this.tableData = response.data
      // 注意作用域问题,加=>和父级作用域相同,去掉function
      })
    },
    getListByName() {
      if (this.ddname !== '') {
        fetchByName(this.ddname).then((response) => {
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
      this.doctor = {
        dno: '',
        dname: '',
        oname: '',
        dphone: '',
        joinDate: '',
        pwd: '123456'
      }
    },
    handleUpdate(intdex, row) {
      this.doctor = Object.assign({}, row)
      this.disabled = true
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.doctor.time = moment().format('YYYY-MM-DD')
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
          console.log(this.doctor)
          // this.$http.post('/patient/insert', this.patients).then((response) => {
          createDoctor(this.doctor).then((response) => {
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
          console.log(this.doctor)
          // this.mrs.updateData = moment().format('YYYY-MM-DD')
          updateDoctor(this.doctor).then((response) => {
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
  .filter-container_d{
    padding-bottom: 1%;
    padding-top: 1%;

  }
  .filter-container_d .el-input{
    padding-right: 1%;
    }
    .filter-container_d .el-input{
      padding-left: 1%;
    }
  </style>

