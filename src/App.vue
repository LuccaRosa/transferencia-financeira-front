<template>
    <div style="height:100vh;width:100vw;">
      <a-card title="Envio de transferência" :bordered="false" style="margin: 20px">
        <a-form name="basic" layout="inline" :model="formState" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }"
          @finish="handleFinish" @finishFailed="handleFinishFailed" autocomplete="off">
          <a-form-item label="Conta de Origem" name="contaOrigem" :rules="[
            { required: true, message: 'Por favor insira sua conta de origem!' },
            { min: 6, max: 6, message: 'Conta de origem inválida', trigger: 'change' }]">
            <a-input type="number" placeholder="Conta de Origem" required v-model:value="formState.contaOrigem" />
          </a-form-item>
          <a-form-item label="Conta de Destino" name="contaDestino" :rules="[
            { required: true, message: 'Por favor insira sua conta de destino!' },
            { min: 6, max: 6, message: 'Conta de destino inválida', trigger: 'change' }]">
            <a-input type="number" placeholder="Conta de Destino" required v-model:value="formState.contaDestino" />
          </a-form-item>
          <a-form-item label="Data de Agendamento" name="dataAgendamento"
            :rules="[{ required: true, message: 'Por favor insira a data de agendamento!' }]">
            <a-date-picker style="width: 100%; margin-left: 6px;" placeholder="Data"
              v-model:value="formState.dataAgendamento" />
          </a-form-item>
          <a-form-item label="Valor da transferência" name="valorTransferencia"
            :rules="[{ required: true, message: 'Por favor insira valor da transferência!' }]">
            <a-input-number type="number" placeholder="Valor da transferência" style="width: 100%" required
              v-model:value="formState.valorTransferencia" />
          </a-form-item>
          <a-button type="primary" :disabled="disabled" html-type="submit">Enviar Transação</a-button>
        </a-form>
      </a-card>


      <a-card title="Transferências:" :bordered="false" style="margin: 10px" pagination="false">

        <a-table :columns="columns" :data-source="transferencia" pagination="false">
          <template #headerCell="{ column }">
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'Conta de Origem'">
              <span>
                {{ record.contaOrigem }}
              </span>
            </template>
            <template v-else-if="column.key === 'Conta Destino'">
              <span>
                {{ record.contaDestino }}
              </span>
            </template>
            <template v-else-if="column.key === 'Data de Transferência'">
              <span>
                {{ record.dataTransferencia }}
              </span>
            </template>
            <template v-else-if="column.key === 'Data de Agendamento'">
              <span>
                {{ record.dataAgendamento }}
              </span>
            </template>
            <template v-else-if="column.key === 'Valor de Transferência'">
              <span>
                {{ formataNumero(record.valorTransferencia) }}
              </span>
            </template>
            <template v-else-if="column.key === 'Taxa'">
              <span>
                {{ formataNumero(record.taxa) }}
              </span>
            </template>
          </template>
        </a-table>

      </a-card>
    </div>
</template>

<script>
import axios from 'axios'
import { reactive, computed } from 'vue';
import { notification } from 'ant-design-vue';

const formState = reactive({
  contaOrigem: '',
  contaDestino: '',
  dataAgendamento: '',
  valorTransferencia: '',
});

const openNotificationWithIcon = (type, messageTitle, messageDescription) => {
  notification[type]({
    message: messageTitle,
    description: messageDescription,
    placement: 'bottom',
  });
};

const disabled = computed(() => {
  return !(formState.contaOrigem && formState.contaDestino && formState.dataAgendamento && formState.valorTransferencia);
});

export default {
  data() {
    return {
      formState,
      columns: [
        {
          title: 'Conta de Origem',
          dataIndex: 'Conta de Origem',
          key: 'Conta de Origem',
        },
        {
          title: 'Conta Destino',
          dataIndex: 'Conta Destino',
          key: 'Conta Destino',
        },
        {
          title: 'Data de Transferência',
          dataIndex: 'Data de Transferência',
          key: 'Data de Transferência',
        },
        {
          title: 'Data de Agendamento',
          dataIndex: 'Data de Agendamento',
          key: 'Data de Agendamento',
        },
        {
          title: 'Valor de Transferência',
          dataIndex: 'Valor de Transferência',
          key: 'Valor de Transferência',
        },
        {
          title: 'Taxa',
          dataIndex: 'Taxa',
          key: 'Taxa',
        },
      ],
      transferencia: [],
    };
  },
  methods: {
    clearForm() {
      formState.contaOrigem = '';
      formState.contaDestino = '';
      formState.dataAgendamento = '';
      formState.valorTransferencia = '';
    },
    handleFinish(values) {
      console.log(values, formState);
      this.criarTransacao(values)
    },
    handleFinishFailed(errors) {
      console.log(errors);
    },
    listarTransacao() {
      axios.create({ baseURL: 'http://localhost:8080' }).get('/api/v1/transacao').then((response) => {
        this.transferencia = response.data;
      })
    },
    criarTransacao(data) {
      axios.create({ baseURL: 'http://localhost:8080' }).post('/api/v1/transacao', {
        contaOrigem: data.contaOrigem,
        contaDestino: data.contaDestino,
        dataAgendamento: data.dataAgendamento.format('YYYY-MM-DD'),
        valorTransferencia: data.valorTransferencia
      }).then((response) => {
        this.clearForm();
        this.listarTransacao();
        openNotificationWithIcon('success', 'Sucesso!', 'Transferência realizada com sucesso!')
      }).catch((error) => {
        console.log(error)
        openNotificationWithIcon('error', 'Houve um erro ao realizar a transferência!!', 'Tente novamente mais tarde')
      })
    },
    formataNumero(num) {
      return parseFloat(num).toFixed(2)
    }
  },
  mounted() {
    this.listarTransacao();
    openNotificationWithIcon('info', 'Bem vindo ao sistema de transferência', 'Para realizar uma transferência, preencha os campos e clique em enviar transação')
  }
}

</script>
