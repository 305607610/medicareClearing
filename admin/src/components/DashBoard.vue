<template>
  <div style="height: 100%">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>Dashboard</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <h3 style="margin:0px 0px 0px 20px">清算分析</h3>
      <!-- <table width="600" style="text-align:left;margin:0px 0px 20px 20px">
        <tr style="font-size:25px;">
          <th style="color:#ff2e63">{{allMoney | rounding}}</th>
          <th style="color:#a7e9af">{{clearMoney | rounding}}</th>
          <th style="color:#ff2e63">{{allOrder}}</th>
          <th style="color:#a7e9af">{{clearOrder}}</th>
        </tr>
        <tbody>
          <tr style="height:50px;line-height:50px">
            <td>总金额</td>
            <td>报销金额</td>
            <td>总订单数</td>
            <td>已清算订单数</td>
          </tr>
        </tbody>
      </table>-->
      <div class="card-list">
        <el-card style="background-image: linear-gradient(#deddfa, #dab8f3);">
          <div class="num">{{allMoney | rounding}}</div>
          <br />
          <div class="word">总金额</div>
        </el-card>
        <el-card style="background-image: linear-gradient(#b2ebf2, #00bcd4);">
          <div class="num" style="color:#7e0cf5;">{{clearMoney | rounding}}</div>
          <br />
          <div class="word">报销金额</div>
        </el-card>
        <el-card style="background-image: linear-gradient(#eef9bf, #a7e9af);">
          <div class="num">{{allOrder}}</div>
          <br />
          <div class="word">总订单数</div>
        </el-card>
        <el-card style="background-image: linear-gradient(#fff3af, #ffd271);">
          <div class="num" style="color:#5edfff">{{clearOrder}}</div>
          <br />
          <div class="word">已清算订单数</div>
        </el-card>
      </div>

      <el-tabs type="card" @tab-click="handleClick" v-model="active">
        <el-tab-pane label="报销汇总" name="0">
          <div id="qingsuan" style="width: 80vw;height:500px;margin-top:20px"></div>
        </el-tab-pane>
        <el-tab-pane label="订单汇总" name="1">
          <div id="dingdan" style="width: 80vw;height:500px;margin-top:20px"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  filters: {
    rounding(value) {
      return value.toFixed(2)
    }
  },
  name: 'DashBoard',
  data() {
    return {
      active: '0',
      allMoney: 0,
      allMoneyList: [],
      clearMoneyList: [],
      clearMoney: 0,
      allOrder: 0,
      clearOrder: 0
    }
  },
  mounted() {
    this.getMoneyList()
    // this.getOrderList()
  },
  created() {
    this.getAllMoney()
    this.getAllOrder()
  },
  methods: {
    getDateList(day) {
      var today = new Date()
      var targetday = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetday)
      var tYear = today.getFullYear()
      var tMonth = today.getMonth()
      var tDate = today.getDate()
      tMonth = this.doHandleMonth(tMonth + 1)
      tDate = this.doHandleMonth(tDate)
      return tYear + '-' + tMonth + '-' + tDate
    },
    doHandleMonth(month) {
      var m = month
      if (month.toString().length === 1) {
        m = '0' + month
      }
      return m
    },

    async getAllMoney() {
      const { data: res } = await this._http.get('dashboard/allmoney')
      this.allMoney = res.allMoney
      this.clearMoney = res.clearMoney
    },
    handleClick() {
      if (this.active === '0') {
        this.getMoneyList()
      }
      if (this.active === '1') {
        this.getOrderList()
      }
    },
    async getMoneyList() {
      const qingsuan = echarts.init(document.getElementById('qingsuan'))
      const { data: res } = await this._http.get('dashboard/moneylist')
      qingsuan.setOption({
        legend: {
          data: ['总金额', '报销金额']
        },
        xAxis: {
          type: 'category',
          name: '交易日期',
          data: [
            `${this.getDateList(-6)}`,
            `${this.getDateList(-5)}`,
            `${this.getDateList(-4)}`,
            `${this.getDateList(-3)}`,
            `${this.getDateList(-2)}`,
            `${this.getDateList(-1)}`,
            `${this.getDateList(0)}`
          ]
        },
        yAxis: {
          type: 'value',
          name: '交易金额'
        },
        tooltip: {
          trigger: 'axis'
        },
        series: [
          {
            name: '总金额',
            data: res.allMoney,
            type: 'line',
            // areaStyle: {
            //   normal: { color: '#e58a8a' }
            // },
            itemStyle: {
              normal: {
                color: '#dd2c00',
                lineStyle: {
                  color: '#ff5722'
                }
              }
            }
          },
          {
            name: '报销金额',
            data: res.clearMoney,
            type: 'line',
            // areaStyle: {
            //   normal: { color: '#b9ebcc' }
            // },
            itemStyle: {
              normal: {
                color: '#80bdab',
                lineStyle: {
                  color: '#a7e9af'
                }
              }
            }
          }
        ]
      })
    },
    async getOrderList() {
      const dingdan = echarts.init(document.getElementById('dingdan'))
      const { data: res } = await this._http.get('dashboard/orderlist')
      dingdan.setOption({
        legend: {
          data: ['总订单', '已清算订单']
        },
        xAxis: {
          type: 'category',
          name: '交易日期',
          data: [
            `${this.getDateList(-6)}`,
            `${this.getDateList(-5)}`,
            `${this.getDateList(-4)}`,
            `${this.getDateList(-3)}`,
            `${this.getDateList(-2)}`,
            `${this.getDateList(-1)}`,
            `${this.getDateList(0)}`
          ]
        },
        yAxis: {
          type: 'value',
          name: '订单数'
        },
        tooltip: {
          trigger: 'axis'
        },
        series: [
          {
            name: '总订单',
            data: res.allOrder,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#dd2c00',
                lineStyle: {
                  color: '#ff5722'
                }
              }
            }
          },
          {
            name: '已清算订单',
            data: res.clearOrder,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#80bdab',
                lineStyle: {
                  color: '#a7e9af'
                }
              }
            }
          }
        ]
      })
    },
    async getAllOrder() {
      const { data: res } = await this._http.get('dashboard/allorder')
      this.allOrder = res.allOrder
      this.clearOrder = res.clearOrder
    }
  }
}
</script>

<style scoped>
.card-list {
  display: flex;
  justify-content: space-around;
}
.card-list .el-card {
  display: flex;
  align-items: center;
  width: 23%;
  height: 180px;
  margin: 30px 0px;
  line-height: 30px;
}
.box-card {
  margin-top: 20px;
  /* height: 96%; */
  min-height: 96%;
}
.line {
  width: 100%;
  height: 500px;
}
.num {
  color: #ff2e63;
  font-size: 25px;
  font-weight: 900;
}
.word {
  font-size: 18px;
  font-weight: 500;
}
</style>
