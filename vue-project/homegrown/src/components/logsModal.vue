<script setup>
const { show } = defineProps({
    show: Boolean,
});
</script>

<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container p-5 w-1">
                <div class="modal-header mb-5">
                    <slot name="header">this is header default </slot>
                </div>

                <div class="container ">
                    <!-- update validation func later -->
                    <form class="row g-3 needs-validation" novalidate>
                        
                        <div class="col-md-6">
                            <label for="validationCustom01" class="form-label">Title</label>
                            <input type="text" class="form-control" id="validationCustom01" placeholder="Enter title"
                                required>
                            <div class="invalid-feedback">
                                Please enter a title.
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <label for="validationCustom05" class="form-label">Payment Date</label>
                            <input type="date" class="form-control" id="validationCustom05" required>
                            <div class="invalid-feedback">
                                Please provide a date.
                            </div>
                            <span id="dateHelpBlock" class="form-text text-muted">According to slip/transaction</span>
                        </div>
                        
                        <div class="col-md-6">
                            <label for="validationCustomUsername" class="form-label">Amount</label>
                            <div class="input-group has-validation">
                                <span class="input-group-text" id="inputGroupPrepend">SGD$</span>
                                <input type="number" class="form-control" id="validationCustomUsername"
                                    aria-describedby="inputGroupPrepend" placeholder="Enter payment amount" required>
                                <div class="invalid-feedback">
                                    Please enter a valid number.
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <label for="validationCustom03" class="form-label">Payment Slip</label>
                            <div class="input-group has-validation">
                                <input type="file" class="form-control" id="validationCustom03" required>
                            </div>
                            <div class="invalid-feedback">
                                Please provide an image of payment slip.
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <label for="validationCustom04" class="form-label">Payment Type</label>
                            <select class="form-select" id="validationCustom04" required>
                                <option selected disabled value="">Select...</option>
                                <option value="bonus">Bonus</option>
                                <option value="monthly pay">Monthly Pay</option>
                            </select>
                            <div class="invalid-feedback">
                                Please select one.
                            </div>
                        </div>
                        
                        <div class="col-12">
                            <div class="form-check">
                                <input class="form-check-input border-1 border-dark" type="checkbox" value=""
                                    id="invalidCheck" required>
                                <label class="form-check-label" for="invalidCheck">
                                    I have checked that the infromation is accurate to the best of my abillity
                                </label>
                                <div class="invalid-feedback">
                                    You must agree before submitting.
                                </div>
                            </div>
                        </div>
                    </form>

                </div>

                <div class="modal-footer">
                    <button class="btn btn-danger m-3" type="button" @click="$emit('close')">Cancel</button>
                    <!-- add addlogs fucntion here -->
                    <button class="btn btn-success" type="submit" @click="() => {  $emit('close'); }">Add log</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .15);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;
}

.modal-container {
    width: 90%;
    max-width: 600px;
    max-height: 80vh; /* Limit height to 80% of viewport */
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    overflow-y: auto; /* Enable vertical scrolling */
    transition: all 0.3s ease;
    padding-top: 0px;
}

.modal-header {
    margin-top: 0;

}

.modal-default-button {
    float: right;
}

/* if got time implement sticky header */
/* .modal-header, .modal-footer {
    position: sticky;
    top: 0; 
    background-color: white;
    z-index: 1;
} */
/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(2);
}
</style>