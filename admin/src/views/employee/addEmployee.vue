<template>
  <div class="addBrand-container">
    <HeadLable :title="title"
               :goback="true" />
    <div class="container">
      <el-form ref="ruleForm"
               :model="ruleForm"
               :rules="rules"
               :inline="false"
               label-width="180px"
               class="demo-ruleForm">
        <!--          <el-form-item label="员工职级" prop="region">-->
        <!--            <el-select v-model="ruleForm.region" placeholder="请选择品牌名称">-->
        <!--              <el-option label="区域一" value="shanghai"></el-option>-->
        <!--              <el-option label="区域二" value="beijing"></el-option>-->
        <!--            </el-select>-->
        <!--            <el-button @click="submitForm('ruleForm')" type="primary" class="continue" style="margin-left: 10px;" >+新增职级</el-button>-->
        <!--          </el-form-item>-->
        <el-form-item label="username:"
                      prop="username">
          <el-input v-model="ruleForm.username"
                    placeholder="Please eneter username"
                    maxlength="20" />
        </el-form-item>
        <el-form-item label="name:"
                      prop="name">
          <el-input v-model="ruleForm.name"
                    placeholder="Please enetr real name"
                    maxlength="12" />
        </el-form-item>
	  <!--    请看这里！！！！！！！！！！-->
            <el-form-item label="chef image:"
                        prop="image">
            <image-upload :prop-image-url="imageUrl"
                          @imageChange="imageChange">
              Image size don't exceed 2M<br>Only upload PNG JPEG JPG<br>
            </image-upload>
          </el-form-item>

        <el-form-item label="phone number:"
                      prop="phone">
          <el-input v-model="ruleForm.phone"
                    placeholder="Please enter your phone number"
                    maxlength="8" />
        </el-form-item>
        <el-form-item label="gender:"
                      prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="Male" />
            <el-radio label="Female" />
          </el-radio-group>

        </el-form-item>
        <el-form-item label="NRIC:"
                      prop="idNumber"
                      class="idNumber">
          <el-input v-model="ruleForm.idNumber"
                    placeholder="Please enter your NRIC"
                    maxlength="20" />
        </el-form-item>
        <div class="subBox address">
          <!-- <el-form-item> -->
          <el-button @click="() => $router.push('/employee')">
            Cancel
          </el-button>
          <el-button type="primary"
                     :class="{ continue: actionType === 'add' }"
                     @click="submitForm('ruleForm', false)">
            Save
          </el-button>
          <el-button v-if="actionType == 'add'"
                     type="primary"
                     @click="submitForm('ruleForm', true)">
            Save and Continue Adding
          </el-button>
          <!-- </el-form-item> -->
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import HeadLable from '@/components/HeadLable/index.vue'
import { queryEmployeeById, addEmployee, editEmployee } from '@/api/employee'
import ImageUpload from '@/components/ImgUpload/index.vue'

@Component({
  name: 'addShop',
  components: {
    HeadLable,
    ImageUpload
  }
})
export default class extends Vue {
  private title = 'Add Chef'
  private actionType = ''
  private imageUrl: string = ''
  private ruleForm = {
    name: '',
    image: '',
    phone: '',
    // 'password': '',
    // 'rePassword': '',
    sex: '男',
    idNumber: '',
    username: ''
  }

  // private validateRepassword (rule:any, value:any, callback:any) {
  //   if (value === '') {
  //     callback(new Error('请再次输入密码'))
  //   } else if (value !== this.ruleForm.password) {
  //     callback(new Error('两次输入密码不一致!'))
  //   } else {
  //     callback()
  //   }
  // }

  // private isCellPhone(val: any) {
  //   if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }
  //
  // private checkphone(rule: any, value: any, callback: any) {
  //   // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
  //   if (value == '') {
  //     callback(new Error('Please enter the phone number'))
  //   } else if (!this.isCellPhone(value)) {
  //     //引入methods中封装的检查手机格式的方法
  //     callback(new Error('Please enter the correct mobile phone number!'))
  //   } else {
  //     callback()
  //   }
  // }
  private checkPhone(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('Please enter the phone number'));
    } else if (!/^\d{8}$/.test(value)) {
      callback(new Error('Please enter a valid phone number with exactly 8 digits!'));
    } else {
      callback();
    }
  }

  // private validID(rule: any, value: any, callback: any) {
  //   // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  //   let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  //   if (value == '') {
  //     callback(new Error('please enter your NRIC'))
  //   } else if (reg.test(value)) {
  //     callback()
  //   } else {
  //     callback(new Error('The ID card number is incorrect'))
  //   }
  // }
  private validID(rule: any, value: any, callback: any) {
    // 身份证号码为9位，首和尾可以是大写字母
    let reg = /^[A-Z]\d{7}[A-Z]$/
    if (value == '') {
      callback(new Error('Please enter your NRIC'))
    } else if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('The NRIC is incorrect'))
    }
  }

  get rules() {
    return {
      name: [
        {
          required: true,
          // 'message': '请输入员工姓名',
          validator: (rule: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('Please enter Chef name'))
            } else {
              const reg = /^[a-zA-Z]{1,12}$/
              if (!reg.test(value)) {
                callback(new Error('Name input is not valid, please enter 1-12 characters.'))
              } else {
                callback()
              }
            //  callback()
            }
          },
          trigger: 'blur'
        }
      ],
      username: [
        {
          required: true,
          // message: '请输入账号',
          validator: (rule: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('请输入账号'))
            } else {
              const reg = /^([a-z]|[0-9]){3,20}$/
              if (!reg.test(value)) {
                callback(new Error('Username input does not meet requirements, please enter 3-20 characters'))
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
        message: '菜品图片不能为空'
      },
      phone: [{ required: true, validator: this.checkPhone, trigger: 'blur' }],
      idNumber: [{ required: true, validator: this.validID, trigger: 'blur' }]
    }
  }

  created() {
    this.actionType = this.$route.query.id ? 'edit' : 'add'
    if (this.$route.query.id) {
      this.title = 'Edit Chef Information'
      this.init()
    }
  }

  private async init() {
    const id = this.$route.query.id
    queryEmployeeById(id).then((res: any) => {
      // String(res.status) === '200'
      if (res.data.code === 1) {
        this.ruleForm = res.data.data
        this.ruleForm.sex = res.data.data.sex === '0' ? 'Female' : 'Male'
        // this.ruleForm.password = ''
	      this.imageUrl = res.data.data.image
      } else {
        this.$message.error(res.data.msg)
      }
      // if (res.data.code == 200) {
      //   const { data } = res.data
      //   this.ruleForm = data
      //   this.ruleForm.password = ''
      //   // this.ruleForm.rePassword = '' //JSON.parse(JSON.stringify(data.password));
      // } else {
      //   this.$message.error(res.data.desc)
      // }
    })
  }

  private submitForm(formName: any, st: any) {
    ;(this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
       if (!this.ruleForm.image) return this.$message.error('菜品图片不能为空')
        let params: any = { ...this.ruleForm }
        if (this.actionType === 'add') {
          const params = {
            ...this.ruleForm,
            sex: this.ruleForm.sex === '女' ? '0' : '1'
          }
          addEmployee(params)
            .then((res: any) => {
              if (res.data.code === 1) {
                this.$message.success('员工添加成功！')
                if (!st) {
                  this.$router.push({ path: '/employee' })
                } else {
		              this.imageUrl = ''
                  this.ruleForm = {
                    username: '',
                    name: '',
                    image:'',
                    phone: '',
                    // 'password': '',
                    // 'rePassword': '',/
                    sex: '男',
                    idNumber: ''
                  }
                }
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(() => {
              // this.$message.error('请求出错了：' + err.message)
            })
        } else {
          const params = {
            ...this.ruleForm,
            sex: this.ruleForm.sex === '女' ? '0' : '1'
          }
          editEmployee(params)
            .then((res: any) => {
              if (res.data.code === 1) {
                this.$message.success('员工信息修改成功！')
                this.$router.push({ path: '/employee' })
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(() => {
              // this.$message.error('请求出错了：' + err.message)
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
.addBrand {
  &-container {
    margin: 30px;
    margin-top: 0px;
    .HeadLable {
      background-color: transparent;
      margin-bottom: 0px;
      padding-left: 0px;
    }
    .container {
      position: relative;
      z-index: 1;
      background: #fff;
      padding: 30px;
      border-radius: 4px;
      // min-height: 500px;
      .subBox {
        padding-top: 30px;
        text-align: center;
        border-top: solid 1px $gray-5;
      }
    }
    .idNumber {
      margin-bottom: 39px;
    }

    .el-form-item {
      margin-bottom: 29px;
    }
    .el-input {
      width: 293px;
    }
     .upload-item {
        .el-form-item__error {
          top: 90%;
        }
      }
  }
}
</style>
