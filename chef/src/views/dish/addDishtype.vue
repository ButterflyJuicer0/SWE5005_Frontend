<template>
  <div :key="vueRest"
       class="addBrand-container">
    <div :key="restKey"
         class="container">
      <el-form ref="ruleForm"
               :model="ruleForm"
               :rules="rules"
               :inline="true"
               label-width="180px"
               class="demo-ruleForm">
        <div>
          <el-form-item label="Dish Name:"
                        prop="name">
            <el-input v-model="ruleForm.name"
                      placeholder="Please enter Dish name"
                      maxlength="20" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Dish Price:"
                        prop="price">
            <el-input v-model="ruleForm.price"
                      placeholder="Please set dish price " />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Dish Image:"
                        prop="image">
            <image-upload :prop-image-url="imageUrl"
                          @imageChange="imageChange">
              Image size don't exceed 2M<br>Only upload PNG JPEG JPG<br>
            </image-upload>
          </el-form-item>
        </div>
        <div class="address">
          <el-form-item label="Dish Discription:"
                        prop="region">
            <el-input v-model="ruleForm.description"
                      type="textarea"
                      :rows="3"
                      maxlength="200"
                      placeholder="Not exceed 200 words" />
          </el-form-item>
        </div>
        <div class="subBox address">
          <el-button @click="() => $router.back()">
            Cancel
          </el-button>
          <el-button type="primary"
                     :class="{ continue: actionType === 'add' }"
                     @click="submitForm('ruleForm')">
            Save
          </el-button>
          <el-button v-if="actionType === 'add'"
                     type="primary"
                     @click="submitForm('ruleForm', 'goAnd')">
            Save and continue adding
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import HeadLable from '@/components/HeadLable/index.vue'
import SelectInput from './components/SelectInput.vue'
import ImageUpload from '@/components/ImgUpload/index.vue'

import {
  queryDishById,
  addDish,
  editDish,
  getCategoryList,
} from '@/api/dish'
import { baseUrl } from '@/config.json'
import { getToken } from '@/utils/cookies'
@Component({
  name: 'addShop',
  components: {
    HeadLable,
    SelectInput,
    ImageUpload
  }
})
export default class extends Vue {
  private restKey: number = 0
  private textarea: string = ''
  private value: string = ''
  private imageUrl: string = ''
  private actionType: string = ''
  private dishList: string[] = []
  private dishFlavorsData: any[] = [] //原始口味数据
  private dishFlavors: any[] = [] //待上传口味的数据
  private leftDishFlavors: any[] = [] //下拉框剩余可选择的口味数据
  private vueRest = '1'
  private index = 0
  private inputStyle = { flex: 1 }
  private headers = {
    token: getToken()
  }
  private ruleForm = {
    name: '',
    id: '',
    chef_id:'',
    price: '',
    code: '',
    image: '',
    description: '',
    status: true,
  }

  get rules() {
    return {
      name: [
        {
          required: true,
          validator: (rule: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('Add Dish Name'))
            } else if (value.length > 64) {
              callback(new Error('Must should longer than 64 digits'))
            }else {
              const reg = /^([A-Za-z0-9\u4e00-\u9fa5]){2,64}$/
              if (!reg.test(value)) {
                callback(new Error('Dish name is uncorrect'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }
      ],
      image: {
        required: true,
        message: 'Image should not be empty'
      },
      price: [
        {
          required: true,
          validator: (rules: any, value: string, callback: Function) => {
            const reg = /^([1-9]\d{0,5}|0)(\.\d{1,2})?$/
            if (!reg.test(value) || Number(value) <= 0) {
              callback(
                new Error(
                  'Price format is wrong'
                )
              )
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      code: [{ required: true, message: 'Please enter product code', trigger: 'blur' }]
    }
  }

  created() {
    this.getDishList()
    this.actionType = this.$route.query.id ? 'edit' : 'add'
    if (this.$route.query.id) {

      this.init()
    }
  }

  private async init() {
    queryDishById(this.$route.query.id).then(res => {
      if (res && res.data && res.data.code === 1) {
        this.ruleForm = { ...res.data.data }
        this.ruleForm.price = String(res.data.data.price)
        this.ruleForm.status = res.data.data.status == '1'
        this.imageUrl = res.data.data.image
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }
  private getDishList() {
    console.log(this.$route.query.id)
    getCategoryList({ type: 1 }).then(res => {
      if (res.data.code === 1) {
        this.dishList = res && res.data && res.data.data
      } else {
        this.$message.error(res.data.msg)
      }
    })
  }

  private submitForm(formName: any, st: any) {
    (this.$refs[formName] as any).validate((valid: any) => {
      console.log(valid, 'valid')
      if (valid) {
        if (!this.ruleForm.image) return this.$message.error('Dish Image is empty')
        let params: any = { ...this.ruleForm }
        params.status =
          this.actionType == 'add' ? 0 : this.ruleForm.status ? 1 : 0
        if (this.actionType == 'add') {
          console.log(localStorage.getItem('chefID'))
          params.chef_id= localStorage.getItem('chefID')
          addDish(params)
            .then(res => {
              if (res.data.code === 1) {
                this.$message.success('Add dish successfully')
                if (!st) {
                  this.$router.push({ path: '/dish' })
                } else {
                  // this.dishFlavorsData = []
                  this.imageUrl = ''
                  this.ruleForm = {
                    name: '',
                    id: '',
                    chef_id: localStorage.getItem('chefID'),
                    price: '',
                    code: '',
                    image: '',
                    description: '',
                    status: true,
                  }
                  this.restKey++
                }
              } else {
                this.$message.error(res.data.desc || res.data.msg)
              }
            })
            .catch(err => {
              this.$message.error('Request wrong：' + err.message)
            })
        } else {
          params.id=this.$route.query.id
          editDish(params)
            .then(res => {
              if (res && res.data && res.data.code === 1) {
                this.$router.push({ path: '/dish' })
                this.$message.success('Dish modify successfully')
              } else {
                this.$message.error(res.data.desc || res.data.msg)
              }
            })
            .catch(err => {
              this.$message.error('Request wrong：' + err.message)
            })
        }
      } else {
        return false
      }
    })
  }

  imageChange(value: any) {
    this.ruleForm.image = value
  }
}
</script>
<style lang="scss" scoped>
.addBrand-container {
  .el-form--inline .el-form-item__content {
    width: 293px;
  }

  .el-input {
    width: 350px;
  }

  .address {
    .el-form-item__content {
      width: 777px !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.addBrand {
  &-container {
    margin: 30px;

    .container {
      position: relative;
      z-index: 1;
      background: #fff;
      padding: 30px;
      border-radius: 4px;
      min-height: 500px;

      .subBox {
        padding-top: 30px;
        text-align: center;
        border-top: solid 1px $gray-5;
      }
      .upload-item {
        .el-form-item__error {
          top: 90%;
        }
      }
    }
  }
}

.flavorBox {
  width: 777px;

  .addBut {
    background: #ffc200;
    display: inline-block;
    padding: 0px 20px;
    border-radius: 3px;
    line-height: 40px;
    cursor: pointer;
    border-radius: 4px;
    color: #333333;
    font-weight: 500;
  }

  .flavor {
    border: solid 1px #dfe2e8;
    border-radius: 3px;
    padding: 15px;
    background: #fafafb;

    .title {
      color: #606168;
      .des-box {
        padding-left: 44px;
      }
    }

    .cont {
      .items {
        display: flex;
        margin: 10px 0;

        .itTit {
          width: 150px;
          margin-right: 15px;

          input {
            width: 100%;
            // line-height: 40px;
            // border-radius: 3px;
            // padding: 0 10px;
          }
        }

        .labItems {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          border-radius: 3px;
          min-height: 39px;
          border: solid 1px #d8dde3;
          background: #fff;
          padding: 0 5px;

          span {
            display: inline-block;
            color: #ffc200;
            margin: 5px;
            line-height: 26px;
            padding: 0 10px;
            background: #fffbf0;
            border: 1px solid #fbe396;
            border-radius: 4px;
            font-size: 12px;

            i {
              cursor: pointer;
              font-style: normal;
            }
          }

          .inputBox {
            display: inline-block;
            width: 100%;
            height: 36px;
            line-height: 36px;
            overflow: hidden;
          }
        }

        .delFlavor {
          display: inline-block;
          padding: 0 10px;
          color: #f19c59;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
