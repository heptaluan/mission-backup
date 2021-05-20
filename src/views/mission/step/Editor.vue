<template>
  <div class="edit-box">
    <div ref="editBox"></div>
  </div>
</template>

<script>
// 引入 wangEditor
import wangEditor from 'wangeditor'

export default {
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    const editor = new wangEditor(this.$refs.editBox)
    editor.config.onchange = newHtml => {
      this.$emit('update:content', newHtml)
    }
    editor.create()
    this.editor = editor
  },
  methods: {
    getEditorData() {
      let data = this.editor.txt.html()
      console.log(data)
    }
  },
  beforeDestroy() {
    this.editor.destroy()
    this.editor = null
  }
}
</script>

<style lang="less" scoped>

</style>
