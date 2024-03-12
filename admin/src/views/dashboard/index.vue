<template>
  <div class="welcome-page">
    <h1>Welcome to the Admin Page</h1>
    <p>Here you can add chef and manage chef information</p>
    <router-link to="/employee">View Chef</router-link>
    <router-link to="/employee/add"> / Add Chef</router-link>

  </div>
</template>

<script>
export default {
  name: "WelcomePage"
};
</script>

<style scoped>
.welcome-page {
  text-align: center;
  margin-top: 50px;
}

h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  margin-bottom: 30px;
}

router-link {
  margin: 0 10px;
  font-size: 16px;
  text-decoration: none;
  color: #007bff;
}
</style>
