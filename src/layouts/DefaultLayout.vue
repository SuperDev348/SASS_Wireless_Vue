<template>
  <div class="d-flex flex-grow-1 white">
    <!-- Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      app
      floating
      class="elevation-1 grey lighten-4"
      :right="$vuetify.rtl"
      :light="menuTheme === 'light'"
      :dark="menuTheme === 'dark'"
    >
      <!-- Navigation menu info -->
      <template v-slot:prepend>
        <div class="pa-2 text-center">
          <img :src="companyLogoPath" style="width: 160px;">
        </div>
      </template>
      
      <main-menu :menu="userMenu" />

      <!-- Navigation menu footer -->
      <template v-slot:append>
        <!-- Footer navigation links -->
        <div class="pa-1 text-center">
          <v-btn
            v-for="(item, index) in navigation.footer"
            :key="index"
            :href="item.href"
            :target="item.target"
            small
            text
          >
            {{ item.text }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar
      app
      :color="isToolbarDetached ? 'transparent' : undefined"
      :flat="isToolbarDetached"
      :light="toolbarTheme === 'light'"
      :dark="toolbarTheme === 'dark'"
    >
      <v-card class="flex-grow-1 d-flex" :class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']" :flat="!isToolbarDetached">
        <div class="d-flex flex-grow-1 align-center">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-spacer class="d-none d-lg-block"></v-spacer>
          <toolbar-user />
        </div>
      </v-card>
    </v-app-bar>

    <v-main>
      <v-container :fluid="!isContentBoxed">
        <v-layout>
          <slot></slot>
        </v-layout>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

// navigation menu configurations
import config from '../configs'

import MainMenu from '../components/navigation/MainMenu'
import ToolbarUser from '../components/toolbar/ToolbarUser'

export default {
  components: {
    MainMenu,
    ToolbarUser
  },
  data() {
    return {
      drawer: null,
      showSearch: false,
      navigation: config.navigation,
      logoImgError: false
    }
  },
  computed: {
    ...mapState('app', ['product', 'isContentBoxed', 'menuTheme', 'toolbarTheme', 'isToolbarDetached']),
    ...mapState({
      authUser: (state) => state.auth.user,
      routers: (state) => state.auth.user.routers
    }),
    companyLogoPath() {
      if (!this.authUser.company || this.authUser.company.logoType === 0)
        return '../../images/logo.png'
      else if (this.authUser.company.logoType === 1)
        return this.authUser.company.logoLink
      else
        return `http://localhost:3000/uploads/logos/${this.authUser.company.logo}`
    },
    customerMenu() {
      let routersMenu

      if (this.authUser.roleId === 4)
        routersMenu = this.navigation.customerMenu
      else if (this.authUser.roleId === 5)
        routersMenu = this.navigation.customerManagerMenu

      let menu

      if (this.routers.length > 0) {
        menu = {
          icon: 'mdi-router-network', key: 'Routers', text: 'Routers', regex: /^\/router-dashboard/,
          items: this.routers.map((router) => {
            return {
              key: router.full_product_name,
              text: router.full_product_name,
              link: `/router-dashboard/${router.id}`
            }
          })
        }
      } else {
        menu = { icon: 'mdi-router-network', key: 'Routers', text: 'Routers' }
      }

      routersMenu[0].items.splice(1, 0, menu)

      return routersMenu
    },
    userMenu() {
      switch (this.authUser.roleId) {
      case 100:
        return this.navigation.superAdminMenu
      case 1:
      case 2:
        return this.navigation.menu
      case 3:
        return this.navigation.koreViewerMenu
      case 4:
      case 5:
        return this.customerMenu
      case 6:
        return this.navigation.customerOperatorMenu
      default:
        return null
      }
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
