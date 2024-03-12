<template>
  <div class="dashboard-container home">
    <div class="homeMain">
      <!-- Dish Data -->
      <CuisineStatistics :dishesData="dishesData" />
      <!-- end -->
    </div>
    <!-- end -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getOrderData, //订单管理今日订单
  getOverviewDishes, //菜品总览
  getSetMealStatistics, //套餐总览
} from '@/api/index'
import { getOrderListBy } from '@/api/order'
// 菜品总览
import CuisineStatistics from './components/cuisineStatistics.vue'
@Component({
  name: 'Dashboard',
  components: {
    CuisineStatistics
  },
})
export default class extends Vue {
  private todayData = {} as any
  private overviewData = {}
  private orderviewData = {} as any
  private flag = 2
  private tateData = []
  private dishesData = {} as any
  private setMealData = {}
  private orderListData = []
  private counts = 0
  private page: number = 1
  private pageSize: number = 10
  private status = 2
  private orderStatics = {} as any
  created() {
    this.init()
  }
  init() {
    this.$nextTick(() => {
      this.getOrderStatisticsData()
      this.getOverStatisticsData()
    })
  }
  async getOrderStatisticsData() {
    const data = await getOrderData()
    this.orderviewData = data.data.data
  }
  // 获取菜品总览数据
  async getOverStatisticsData() {
    const data = await getOverviewDishes()
    this.dishesData = data.data.data
  }
  //获取待处理，待派送，派送中数量
  getOrderListBy3Status() {
    getOrderListBy({})
      .then((res) => {
        if (res.data.code === 1) {
          this.orderStatics = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      .catch((err) => {
        this.$message.error('Request Erro：' + err.message)
      })
  }
}
</script>

<style lang="scss">
</style>
