<template>
  <div class="dicom-image">
    <img :src="url" class="dicom-image-pic">
  </div>
</template>

<script>
  export default {
    name: 'dicomImage',
    props: {
      url: {
        type: String,
        require: true
      }
    },
    data () {
      return {
        // iamgeUrl: url
      }
    }
  }
</script>