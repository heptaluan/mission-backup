import { checkAbbrUnique } from '../api/api'


export const commonFunctionsMixin = {
  data() {
    return {}
  },
  created() {
  },
  methods: {
    checkAbbr(val, modelForm) {
      const params = {
        abbr: val,
        catalog: this.selectType
      }
      checkAbbrUnique(params).then((res) => {
        if (res.success) {
          console.log('good')
        } else {
          this.$message.warning(`简称已存在`)
          modelForm.departNameAbbr = undefined
        }
      })
    }
  }
}