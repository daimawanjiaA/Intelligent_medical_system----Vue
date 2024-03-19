<template>
  <div>
    <el-table
      v-loading="listLoading"
      class="reg_table"
      :data="tableData"
      border
      style="width: 100%"
      :row-class-name="tableRowClassName"
      :cell-style="setCellColor"
      :header-cell-style="tableHeaderCellStyle"
    >
      <el-table-column label="预约号" prop="id" align="center" width="80" />
      <el-table-column label="患者号" prop="pno" align="center" width="80" />
      <el-table-column label="患者姓名" prop="patient.pname" align="center" width="80" />
      <el-table-column label="患者电话" prop="patient.pphone" align="center" width="100" />
      <el-table-column label="医生号" prop="dno" align="center" width="80" />
      <el-table-column label="医生姓名" prop="doctor.dname" align="center" width="80" />
      <el-table-column label="预约时间" prop="regTime" align="center" width="240" />
      <el-table-column label="预约状态" prop="status" :formatter="formatterColumn" align="center" width="300" />

      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template scope="scope">
          <el-button type="primary" size="mini" @click="updateTo2(scope.$index, scope.row)">
            完成
          </el-button>
        </template>
      </el-table-column></el-table>

  </div>
</template>

<script>
// import { DDno } from '@/store/modules/user'
export default {
  data() {
    return {
      Dno: '',
      listLoading: true,
      status: [0, 1, 2, 3],
      tableData: []

    }
  },
  created() {
    this.Dno = window.localStorage.getItem('DDno')
    this.get_1()
    this.listLoading = false
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    get_1: function() {
      this.$http.get('/register/selectAllByStatus?Dno=' + this.Dno + '&status=1').then((response) => {
        console.log(response.data)
        this.tableData = response.data
        // 注意作用域问题,加=>和父级作用域相同,去掉function
        // 指定等候时间
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    updateTo2(index, row) {
      console.log(row)
      // const fdata = { 'id': row.id, 'status': 2 }
      this.$http.post('/register/UpdateStatus?id=' + row.id + '&status=2').then((response) => {
        // this.$http.post('/register/UpdateStatus', fdata).then((response) => {
        this.$notify({
          position: 'bottom-right',
          title: '成功',
          message: '完成就诊',
          type: 'success',
          duration: 2000
        })
        // 注意作用域问题,加=>和父级作用域相同,去掉function
      })
      this.listLoading = true
      this.get_1()
      this.listLoading = false
    },
    setCellColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 7) {
        return 'color:red;'
      }
    },
    formatterColumn(row, column) {
      switch (row.status) {
        case 0:
          return '等待确认'
        case 1:
          return '已确认'
        case 2:
          return '已完成'
        case 3:
          return '已拒绝'
      }
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
  background: #ebf4f9;
}

.el-table {
  padding-left: 3%;
}

.filter-container {
  padding-bottom: 1%;

}

.filter-container .el-input {
  padding-right: 1%;
}
</style>

