<template>
  <div class="not-found">
    <i class="material-icons">not_interested</i>
    <h2 class="style-1">{{ $t('page_not_found') }}</h2>
    <p>{{ $t('page_not_found_body') }}</p>
  </div>
</template>

<script>
export default {
  name: 'not-found',
};
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;

  i {
    font-size: 48px;
    background-color: var(--white);
    box-shadow: var(--box-shadow);
    color: var(--primary);
    border-radius: 50%;
    padding: 20px;
    margin-bottom: 10px;
  }

  h2 {
    margin-bottom: 5px;
  }

  p {
    line-height: 1.4;
    color: var(--gray);
    max-width: 200px;
    text-align: center;
  }
}
</style>
