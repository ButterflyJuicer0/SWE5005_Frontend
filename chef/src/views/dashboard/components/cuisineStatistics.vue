<template>
  <div class="container">
    <h2 class="homeTitle">
      Dish Overall<span><router-link to="dish">Dish Management</router-link></span>
    </h2>
    <div class="orderviewBox">
      <ul>
        <li>
          <span class="status"><i class="iconfont icon-open"></i>Sailing</span>
          <span class="num">{{ dishesData.sold }}</span>
        </li>
        <li>
          <span class="status"><i class="iconfont icon-stop"></i>Stop Sailing</span>
          <span class="num">{{ dishesData.discontinued }}</span>
        </li>
        <li class="add">
          <router-link to="/dish/add">
            <i></i>
            <p>Add new dish</p>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'cuisineview',
})
export default class extends Vue {
  @Prop() private dishesData!: any
}
</script>
