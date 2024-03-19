<template>
  <div>
    <div class="dashboard-container">
      <div class="dashboard-text">欢迎使用本系统， {{ title }}</div>
    </div>
    <!-- <div class="Echarts">
      <div id="main" style="width: 600px;height:400px;" />
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  dat() {
    return {
      name: 'Echarts',
      title: ''
    }
  },
  mounted() {
    this.myEcharts()
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    var user = window.localStorage.getItem('roles')
    if (user === 'admin') {
      this.title = '管理员先生'
    } else {
      this.title = window.localStorage.getItem('Dname') + '医生'
    }
    console.log(this.title)
    if (location.href.indexOf('#reloaded') === -1) {
      location.href = location.href + '#reloaded'
      location.reload()
    }
  },
  // mounted() {
  //   this.myEcharts()
  // },
  methods: {
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('main'))
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
