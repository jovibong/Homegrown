<template>

    <div>

        <div class="d-flex justify-content-start align-items-center mb-2">
            <span class="fw-bold ps-2">{{ title }}</span>
            <button  class="interact p-2">
                <i class='fas fa-edit'></i>
            </button>
        </div>
        <div>
            <h1 class="text-center text-primary fw-bolder display-5 edit">{{ stat }}</h1>
        </div>
        <div>
            <p class="text-center text-muted edit">{{ description }}</p>
        </div>

    </div>

</template>

<script>

export default {
    props: ['title', 'stat', 'description']
} 
</script>

<style scoped>

.interact {
    color: rgba(255, 207, 89, 1);
    transition: color 0.2s;
}

.interact:hover {
    color: red;
}

.interact:active {
    color: green;
}

button{
    background: transparent;
    border: none;
}


</style>
