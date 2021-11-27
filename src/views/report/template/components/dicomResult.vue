<template>
  <div class="dicom-result">
    <dicom-image v-for="(item, index) in data" :key="index" :url="item.url"></dicom-image>
  </div>
</template>

<script>
  import DicomImage from './dicomImage'
  export default {
    name: 'dicom-result',
    components: { DicomImage },
    props: {
      data: {
        type: Array,
        require: true
      },
      pageConfig: {
        type: Object,
        require: true
      }
    },
  }
</script>
