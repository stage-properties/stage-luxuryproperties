import axios from 'axios';

export const hubspotFormAPI = async (values,type,extraValues) => {
    const config = { // important!
        headers: {
          'Content-Type': 'application/json',
        }
      }

    const data =  {
        fields: [
          {
            name: 'fullname',
            value: values?.fullname,
          },
          {
            name: 'mobilephone',
            value: values?.mobilephone,
          },
          {
            name: 'email',
            value: values?.email,
          },
          {
            name:"hubspot_owner_id",
            value:"559048867"
          },
          {
            name:'property_price',
            value:extraValues?.propertyPrice || ''
          },
          {
            name:'down_payment',
            value:extraValues?.downPayment || ''
          },
          {
            name:'type',
            value:type || ''
          },
          {
            name:'language',
            value:values?.language || ''
          },
          {
            name:'project_name',
            value:extraValues?.project_name || ''
          },
          {
            name:"message",
            value:values?.message || ''
          },
          {
            name: 'url',
            value: window.location.href || ''
          }
        ],
        context:{
          pageUri:window.location.href,
          pageName:extraValues?.pageName || "stage-properties"
        }
      }

    const response = await axios.post(`https://api.hsforms.com/submissions/v3/integration/submit/${process.env.NEXT_PUBLIC_HUBSPOT_PORTALID}/${process.env.NEXT_PUBLIC_HUBSPOT_FORMID}`,data,config)
      return response
}