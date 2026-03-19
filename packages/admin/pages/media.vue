<template>
  <div>
    <section class="_mgbt-12px">
      <div class="_dp-f _jtfct-spbtw _alit-ct">
        <h1 class="_fs-4">Media Library</h1>
      </div>
    </section>

    <MediaGallery />
  </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'auth',
}
</script>