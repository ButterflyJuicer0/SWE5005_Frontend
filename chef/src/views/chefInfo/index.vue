<template>
  <div :key="vueRest"
       class="addBrand-container">
    <div :key="restKey"
         class="container">
      <el-form ref="ruleForm"
               :model="ruleForm"
               :rules="rules"
               :inline="true"
               label-width="300px"
               class="demo-ruleForm">
        <div>
          <el-form-item label="Chef Name:"
                        prop="name">
            <p>{{ruleForm.name}}</p>
          </el-form-item>
          <el-form-item label="Chef Discription:"
                        prop="region">
            <p>{{ruleForm.description}}</p>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="New Password:"
                        prop="password">
            <p>{{ruleForm.password}}</p>
          </el-form-item>
          <el-form-item label="Set Category:">
            <el-select
              v-model="selectVal"
              placeholder="Please choose..."
              size="mini"
              clearable
              ref="select"
              style="width: 300px">
              <el-option
                v-for="item in categoryData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @click.native="setLocalCategory(item.lable)">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="text"
                     size="small"
                     class="blueBug"
                     @click="setChefCategory(sendCategory)">
            Set Chef Category
          </el-button>
        </div>
        <div>
          <el-form-item label="Update Image:"
                        prop="image">
            <image-upload :prop-image-url="imageUrl"
                          @imageChange="imageChange">
              Image size don't exceed 2M<br>Only upload PNG JPEG JPG<br>
            </image-upload>
          </el-form-item>
        </div>
        <div class="subBox address">
          <el-button @click="() => $router.back()">
            Cancel
          </el-button>
          <el-button type="primary" icon="el-icon-edit"  @click="showEditDialog()">
            Modify
          </el-button>
          <el-button type="primary"
                     :class="{ continue: actionType === 'add' }"
                     @click="submitForm('ruleForm')">
            Save
          </el-button>
        </div>
        <!-- 修改用户的对话框 -->
        <el-dialog title="Modify Information" :visible.sync="editDialogVisible" width="50%" @close="closeEditDialog">
          <!-- 内容主体区 -->
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px">
            <el-form-item label="discription" prop="discription">
              <el-input v-model="tempDiscription"
                        type="textarea"
                        :rows="3"
                        maxlength="200"
                        placeholder="Not exceed 200 words" ></el-input>
            </el-form-item>
            <el-form-item label="password" prop="password">
              <el-input v-model="tempPassword"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="submitTempForm">Sure</el-button>
          </span>
        </el-dialog>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import HeadLable from '@/components/HeadLable/index.vue'
import ImageUpload from '@/components/ImgUpload/index.vue'
import {
  getChefInfo,
  editChef
} from '@/api/chef'
import {
  setCategory
}from '@/api/category'
import { baseUrl } from '@/config.json'
import { getToken } from '@/utils/cookies'
@Component({
  name: 'info',
  components: {
    HeadLable,
    ImageUpload
  }
})
export default class extends Vue {
  private restKey: number = 0
  private textarea: string = ''
  private value: string = ''
  private imageUrl: string = ''
  private actionType: string = ''
  private vueRest = '1'
  private index = 0
  private tempPassword: string=''
  private tempDiscription: string=''
  private inputStyle = { flex: 1 }
  private headers = {
    token: getToken()
  }
  private editDialogVisible: boolean=false//控制修改用户对话框的显示与隐藏
  private ruleForm = {
    name: '',
    id: '',
    code: '',
    image: '',
    description: '',
    password:'******'
  }
  private selectVal: string='' // select框的绑定值
  private sendCategory: string=''
  private categoryData = [
    { value: 'Shandong Cuisine', lable: '1' },
    { value: 'Sichuan Cuisine', lable: '2' },
    { value: 'Cantonese Cuisine', lable: '3' },
    { value: 'Hunan Cuisine', lable: '4' },
    { value: 'Anhui Cuisine', lable: '5' },
    { value: 'Jiangsu Cuisine', lable: '6' }
  ]
  get rules() {
    return {
      categoryId: [
        { required: true, message: 'Please enter Dish category', trigger: 'change' }
      ],
      image: {
        required: true,
        message: 'Image should not be empty'
      },
      code: [{ required: true, message: 'Please enter product code', trigger: 'blur' }]
    }
  }

  created() {
    this.actionType = this.$route.query.id ? 'edit' : 'add'
    this.init()
  }

  private async init() {
    const id=localStorage.getItem('chefID')
    getChefInfo(id).then(res => {
      this.ruleForm = { ...res.data.data }
      this.ruleForm.name = res.data.data.name
      this.ruleForm.description=res.data.data.description
      this.imageUrl=res.data.data.image
      })
  }
  setLocalCategory(id:string){
    this.sendCategory=id;
    console.log(this.sendCategory)
  }
  setChefCategory(id:string){
    setCategory(id)
      .then(res => {
        if (res && res.data && res.data.code === 1) {
          this.$message.success('Set Category Success')
        }
      })
  }

  private submitForm(formName: any, st: any) {
    (this.$refs[formName] as any).validate((valid: any) => {
      console.log(valid, 'valid')
      if (valid) {
        let params: any = { ...this.ruleForm }
        editChef(params)
            .then(res => {
              if (res && res.data && res.data.code === 1) {
                this.$router.push({ path: '/chefInfo/modify' })
                this.$router.back()
                this.$message.success('Chef modify successfully')
              } else {
                this.$message.error(res.data.desc || res.data.msg)
              }
            })
            .catch(err => {
              this.$message.error('Request wrong：' + err.message)
            })
      }
    })
  }
  private submitTempForm() {
    if(this.tempPassword!=null){
      this.ruleForm.password=this.tempPassword
    }
    if(this.tempDiscription!=null){
      this.ruleForm.description=this.tempDiscription
    }
    this.closeEditDialog()
  }
  imageChange(value: any) {
    this.ruleForm.image = value
  }
  closeEditDialog(){
    this.editDialogVisible=false;
  }
  showEditDialog(){
    this.editDialogVisible = true;
  }
}

</script>
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
            width: 100px;
            height: 36px;
            line-height: 36px;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
