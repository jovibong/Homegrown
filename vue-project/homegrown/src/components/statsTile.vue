<template>

    <div>

        <div class="row row-cols-2">
            <div class="col-* d-flex justify-content-start ">
                <p class="fw-bold px-3 py-2">{{ title }}</p>
            </div>
            <div class="col-* d-flex justify-content-end">
                <a href="#" class="btn px-3 py-2">
                    <i class='fas fa-edit text-secondary'></i>
                </a>
            </div>
        </div>
        <div class="row">
            <h1 class="text-center text-primary fw-bolder display-3">{{ stat }}</h1>
        </div>
        <div class="row">
            <p class="text-center text-muted">{{ description }}</p>
        </div>

    </div>

</template>

<script>

export default {
    props: ['title', 'stat', 'description']
} 
</script>
