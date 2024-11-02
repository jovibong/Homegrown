<template>

    <div>

        <div class="d-flex justify-content-start align-items-center">
            <span class="fw-bold">{{ title }}</span>
            <a href="#" class="btn">
                <i class='fas fa-edit text-secondary'></i>
            </a>
        </div>
        <div>
            <h1 class="text-center text-primary fw-bolder display-5">{{ stat }}</h1>
        </div>
        <div>
            <p class="text-center text-muted">{{ description }}</p>
        </div>

    </div>

</template>

<script>

export default {
    props: ['title', 'stat', 'description']
} 
</script>

<style scoped>





.bento-stats-btn {
    position: absolute;
    top: 5px;
    right: 5px;
}

.btn-bento {
    position: absolute;
    top: 10px;
    right: 10px;
}

.title-bento {
    position: absolute;
    top: 10px;
    left: 10px;
}
</style>
