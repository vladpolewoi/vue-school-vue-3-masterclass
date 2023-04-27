<template>
  <header
    class="header"
    id="header"
    v-click-outside="() => (isMobileNavMenu = false)"
    v-page-scroll="() => (isMobileNavMenu = false)"
  >
    <routerLink :to="{ name: 'Home' }" class="logo">
      <img src="@/assets/svg/vueschool-logo.svg" />
    </routerLink>

    <div class="btn-hamburger" @click="isMobileNavMenu = !isMobileNavMenu">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>
    <nav class="navbar" :class="{ 'navbar-open': isMobileNavMenu }">
      <ul>
        <li v-if="user" class="navbar-user">
          <a
            @click.prevent="isUserDropdownOpen = !isUserDropdownOpen"
            v-click-outside="() => (isUserDropdownOpen = false)"
          >
            <AppAvatarImage class="avatar-small" :src="user.avatar" />
            <span>
              {{ user.name }}
              <img
                class="icon-profile"
                src="@/assets/svg/arrow-profile.svg"
                alt=""
              />
            </span>
          </a>

          <div
            id="user-dropdown"
            :class="{ 'active-drop': isUserDropdownOpen }"
          >
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <router-link :to="{ name: 'Profile' }"
                  >View profile</router-link
                >
              </li>
              <li class="dropdown-menu-item">
                <a @click.prevent="onSignOut">Sign Out</a>
              </li>
            </ul>
          </div>
        </li>
        <li v-if="!user" class="navbar-item">
          <router-link :to="{ name: 'Login' }">Sign In</router-link>
        </li>
        <li v-if="!user" class="navbar-item">
          <router-link :to="{ name: 'Register' }">Register</router-link>
        </li>
        <li v-if="user" class="navbar-mobile-item">
          <router-link :to="{ name: 'Profile' }">View profile</router-link>
        </li>
        <li v-if="user" class="navbar-mobile-item">
          <a @click.prevent="onSignOut">Sign Out</a>
        </li>
      </ul>

      <!-- <ul>
        <li class="navbar-item">
          <a href="index.html">Home</a>
        </li>
        <li class="navbar-item">
          <a href="category.html">Category</a>
        </li>
        <li class="navbar-item">
          <a href="forum.html">Forum</a>
        </li>
        <li class="navbar-item">
          <a href="thread.html">Thread</a>
        </li>
        <li class="navbar-item mobile-only">
          <a href="profile.html">My Profile</a>
        </li>
        <li class="navbar-item mobile-only">
          <a href="#">Logout</a>
        </li>
      </ul> -->
    </nav>
  </header>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
const user = computed(() => store.getters["auth/getAuthUser"]);
const isUserDropdownOpen = ref(false);
const isMobileNavMenu = ref(false);

function onSignOut() {
  store.dispatch("auth/signOut");
  router.push({ name: "Home" });
}

router.beforeEach(() => {
  isMobileNavMenu.value = false;
});
</script>

<style lang="scss" scoped></style>
