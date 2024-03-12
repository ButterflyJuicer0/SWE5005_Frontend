<template>
  <div class="dashboard-container">
    <div class="container">
      <el-table v-if="tableData.length"
                :data="tableData"
                stripe
                class="tableBox">
        <el-table-column prop="number"
                         label="Order Number">
        </el-table-column>
        <el-table-column prop="consignee"
                         label="Consignee">
        </el-table-column>
        <el-table-column prop="amount"
                         label="Order Amount">
        </el-table-column>
        <el-table-column prop="remark"
                         label="Remark">
        </el-table-column>
        <el-table-column label="Status">
          <template v-slot="scope">
            <div class="tableColumn-status"
                 :class="{ 'stop-use': String(scope.row.status) === '0' }">
              {{ String(scope.row.status) === '0' ? 'Not complete' : 'Complete' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Operating"
                         width="250"
                         align="center">
          <template v-slot:="scope">
            <el-button type="text"
                       size="small"
                       class="delBut"
                       @click="showDetailDialog(scope.row.id)">
              Detail
            </el-button>
            <el-button type="text"
                       size="small"
                       class="blueBug"
                       @click="Complete(scope.row.id)">
              Complete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="Order Detail" :visible.sync="editDialogVisible" width="80%" @close="closeEditDialog">
      <div v-for="item in tableData" :key="item.id" :value='item.value' :label="item.label">
        <div v-for="arry in item.orderDetailList" :key="arry.id" :value='item.value' :label="item.label">
          <div v-if="arry.orderId===orderID">
            <el-table v-if="item.orderDetailList.length"
                      :data="item.orderDetailList"
                      stripe
                      class="tableBox">
              <el-table-column prop="dishName"
                               label="Dish Name">
              </el-table-column>
              <el-table-column prop="dishImage"
                        label="Dish Image">
                <template slot-scope="scope">
                  <img :src="scope.row.dishImage"  min-width="70" height="70" />
                </template>
              </el-table-column>
              <el-table-column prop="amount"
                               label="Dish Amount">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HeadLable from '@/components/HeadLable/index.vue'
import {
  getOrderDetailPage,
  completeOrder
} from '@/api/order'
import InputAutoComplete from '@/components/InputAutoComplete/index.vue'
import Empty from '@/components/Empty/index.vue'
import { baseUrl } from '@/config.json'

@Component({
  name: 'Order',
  components: {
    HeadLable,
    InputAutoComplete,
    Empty
  }
})
export default class extends Vue {
  private input: any = ''
  private counts: number = 0
  private page: number = 1
  private pageSize: number = 10
  private checkList: string[] = []
  private tableData: [] = []
  private dishStatus = ''
  private isSearch: boolean = false
  private editDialogVisible: boolean=false//控制修改用户对话框的显示与隐藏
  private orderID: number = 0

  created() {
    this.init()
  }

  initFun() {
    this.page = 1
    this.init()
  }

  private async init() {
    const chefId=localStorage.getItem('chefID')
    await getOrderDetailPage(chefId)
      .then(res => {
        console.log(res)
        if (res.data.code === 1) {
          this.tableData = res.data.data
          this.counts = Number(res.data.data.total)
        }
      })
      .catch(err => {
        this.$message.error('Order erro：' + err.message)
      })
  }
  closeEditDialog(){
    this.editDialogVisible=false;
  }

  showDetailDialog(order:number){
    this.editDialogVisible = true;
    this.orderID=order;
  }
  private Complete(st: string) {
    completeOrder(st)
      .then(res => {
        if (res.data.code === 1) {
          this.$message.success('Complete Success')
          this.init()
        } else {
          this.$message.error(res.data.msg)
        }
      })
  }
}
</script>
<style lang="scss">
.el-table-column--selection .cell {
  padding-left: 10px;
}
</style>
<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    .container {
      background: #fff;
      position: relative;
      z-index: 1;
      padding: 30px 28px;
      border-radius: 4px;
      //查询黑色按钮样式
      .normal-btn {
        background: #333333;
        color: white;
        margin-left: 20px;
      }
      .tableBar {
        margin-bottom: 20px;

        .tableLab {
          display: inline-block;
          float: right;
          span {
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            padding: 0 20px;
            color: $gray-2;
          }
        }
      }
      .tableBox {
        width: 100%;
        border: 1px solid $gray-5;
        border-bottom: 0;
      }
      .pageList {
        text-align: center;
        margin-top: 30px;
      }
    }
  }
}
</style>
