<template>
    <v-container>
        <v-snackbar v-model="snackbar" :timeout="4000" top :color="snackbarColor">
            {{ snackbarMessage }}
            <template v-slot:action="{ attrs }">
                <v-btn color="white" v-bind="attrs" text @click="snackbar = false">Close</v-btn>
            </template>
        </v-snackbar>
        
        <v-dialog
        v-model="dialog"
        max-width="500px">
        <v-form ref="form">
            <v-card>
                <v-card-title>
                <span class="headline"> Editar Usuário </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>

                            <v-col
                            cols="12"
                            sm="12"
                            md="12">
                                <v-text-field
                                outlined
                                v-model="editedItem.nome_completo"
                                label="Nome do usuário"
                                ></v-text-field>
                            </v-col>

                            <v-col
                            cols="12"
                            sm="12"
                            md="12">
                                <v-text-field
                                outlined
                                v-model="editedItem.username"
                                :rules="usernameRules"
                                label="Email do usuário"
                                ></v-text-field>
                            </v-col>
                            
                            <v-col
                            cols="12"
                            sm="12"
                            md="12">
                                <v-select
                                outlined
                                v-model="editedItem.role"
                                :items="$store.getters.getPermissions"
                                ></v-select>
                            </v-col>

                            <v-col
                            cols="12"
                            sm="12"
                            md="12">
                                <v-select
                                v-model="editedItem.empresa"
                                :items="$store.getters.getAllEmpresasNames"
                                attach
                                chips
                                multiple
                                required
                                :loading="loadingEmpresas"
                                outlined>
                                </v-select>
                            </v-col>

                            <v-col
                            cols="12"
                            sm="12"
                            md="12">
                                <v-text-field
                                hint="Digite a nova senha"
                                outlined
                                v-model="editedItem.password"
                                label="Nova senha para o usuário"
                                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="show ? `` : `password`"
                                @click:append="show=!show"
                                ></v-text-field>
                            </v-col>

                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="dialog=false">
                        Cancelar
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        :loading="loadingSend"
                        @click="updateUser()">
                        Salvar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
        </v-dialog>


        <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
                <v-card-title class="headline justify-center">Tem certeza que deseja apagar esse usuário?</v-card-title>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDelete=false">Cancelar</v-btn>
                <v-btn color="blue darken-1" text :loading="loadingDelete" @click="deleteConfirm()">OK</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-card class="ma-4">
            
            <v-card-title>
                Usuários do Sistema
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Pesquisar"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>

            <v-spacer></v-spacer>
            <v-data-table
            :headers="headers"
            :items="users"
            :loading="loading"
            sort-by="calories"
            class="elevation-1"
            :search="search">
                        
                <template v-slot:[`item.empresa`]="{ item }">
                    {{item.empresa.join(', ')}}
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                    v-if="item.role != 'admin'">
                        mdi-pencil
                    </v-icon>
                    <v-icon
                    small
                    @click="deleteItem(item)"
                    v-if="item.role != 'admin'">
                        mdi-delete
                    </v-icon>
                </template>

                <template v-slot:no-data>
                    <h1 class="font-weight-light"> 
                        {{ solicitacaoMessage }} 
                        <v-icon large class="mb-2"> {{ iconMessage }}</v-icon>
                    </h1> 
                </template>

            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            loadingEmpresas: false,
            search: '',
            loading: false,
            loadingDelete: false,
            loadingSend: false,
            snackbar: false,
            snackbarColor: 'error',
            snackbarMessage: '',
            dialog: false,
            dialogDelete: false,
            solicitacaoMessage: '',
            iconMessage: '',
            headers: [
                { text: 'Nome', align: 'start', value: 'nome_completo' },
                { text: 'E-mail', value: 'username' },
                { text: 'Cargo', value: 'role' },
                { text: 'Empresas', value: 'empresa' },
                { text: 'Ações', value: 'actions', sortable: false },
            ],
            editedItem: {
                id: '',
                username: '',
                nome_completo: '',
                role: '',
                password: ''
            },
            usernameRules: [
                v => !!v || 'Campo obrigatório.', 
                v => /.+@([a-zA-Z0-9]]?)+/.test(v) || 'E-mail deve ser válido.', 
                v => /.+@(.?)+bcb.gov.br/.test(v) || 'Domínio deve finalizar com bcb.gov.br'
            ]
        }
    },
    methods: {
        editItem(item) {
            this.editedItem.id = item.id;
            this.editedItem.username = item.username;
            this.editedItem.nome_completo = item.nome_completo;
            this.editedItem.role = item.role;
            this.editedItem.empresa = item.empresa;
            this.dialog = true;
        },
        deleteItem(item) {
            this.stagedForDeletion = item.username;
            this.dialogDelete = true;
        },
        deleteConfirm() {
            this.loadingDelete = true;
            this.$store.dispatch('deleteUser', this.stagedForDeletion)
            .then(() => {
                this.dialogDelete = false;
                this.loadingDelete = false;
                this.snackbarMessage = "Usuário excluído com sucesso!";
                this.snackbarColor = "success";
                this.snackbar = true;
                this.setUsers();
            })
            .catch(error => {
                console.log(error)
                this.dialogDelete = false;
                this.loadingDelete = false;
                this.snackbarMessage = "Ocorreu um erro ao excluir o usuário...";
                this.snackbarColor = "error";
                this.snackbar = true;
                if (error.response ?.status === 401) {
                    this.snackbarMessage = "Você não está autenticado ou não possui permissão para fazer isso.";
                    this.snackbarColor = "error";
                    this.snackbar = true;
                    this.$store.dispatch('logout');
                } else {
                    this.snackbarMessage = "Ocorreu um erro de comunicação com o servidor.";
                    this.snackbarColor = "error";
                    this.snackbar = true;
                }
            })
        },
        updateUser() {
            if (!this.$refs.form.validate())
                return
            if (!this.editedItem.password)
                this.editedItem.password = null
                
            this.loadingSend = true;
            this.$store.dispatch('updateUser', this.editedItem)
            .then(() => {
                this.dialog = false;
                this.loadingSend = false;
                this.snackbarMessage = "Usuário modificado com sucesso!";
                this.snackbarColor = "success";
                this.snackbar = true;
                this.setUsers();
            })
            .catch(error => {
                console.log(error)
                this.dialog = false;
                this.loadingSend = false;
                this.snackbarMessage = "Ocorreu um erro ao modificar o usuário...";
                this.snackbarColor = "error";
                this.snackbar = true;
                if (error.response ?.status === 401) {
                    this.snackbarMessage = "Você não está autenticado ou não possui permissão para fazer isso.";
                    this.snackbarColor = "error";
                    this.snackbar = true;
                    this.$store.dispatch('logout');
                } else if(error.response?.data?.detail) {
                    this.snackbarMessage = error.response?.data?.detail;
                    this.snackbarColor = "error";
                    this.snackbar = true;
                } else {
                    this.snackbarMessage = "Ocorreu um erro de comunicação com o servidor.";
                    this.snackbarColor = "error";
                    this.snackbar = true;
                }
            })
            .finally(() => {
                this.editedItem.password = null
            })
        },
        setUsers() {
            this.loading = true;
            this.$store.dispatch('getUsers')
            .then(() => {
                if (this.users.length === 0){
                    this.solicitacaoMessage = "Não há usuários cadastrados no momento.";
                    this.iconMessage = "mdi-emoticon-sad-outline";
                }
                this.loading = false;
            })
            .catch(error => {
                this.loading = false;
                this.iconMessage = "mdi-emoticon-sad-outline";
                console.log(error)
                if (error?.response?.status === 401) {
                    this.solicitacaoMessage = "Usuário não possui permissão.";
                    this.$store.dispatch('logout');
                }
                else if (error?.response?.data?.detail){
                    this.solicitacaoMessage = error.response.data.detail;
                } 
                else if (error?.response?.data) {
                    this.solicitacaoMessage = error.response.data;
                } else {
                    this.solicitacaoMessage = "Ocorreu um erro de comunicação com o servidor.";
                }
            })
        }
    },
    mounted() {
        this.loadingEmpresas = true;
        this.$store.dispatch('getEmpresas')
        .then(() => {})
        .catch(error => {
            console.log(error);
            if (error.response)
                this.$store.commit('SET_SNACKBAR', {message: "Houve problema de conexão com o servidor.", color: "error"});
            })
        .finally(() => {
            this.loadingEmpresas = false;
        })
        this.setUsers()
    },
    computed: {
        users() {
            return this.$store.getters.getAllUsers;
        }
    }
}
</script>