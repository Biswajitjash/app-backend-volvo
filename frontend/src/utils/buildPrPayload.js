export const buildPrPayload = (items, options = {}) => {
  const validItems = items.filter(item => {
    if (!item.matnr || item.matnr.trim() === "") {
      console.warn("Skipping item – Missing Material Number", item);
      return false;
    }
    if (!item.OrdQty || Number(item.OrdQty) <= 0) {
      console.warn("Skipping item – Invalid Quantity", item);
      return false;
    }
    return true;
  });

  if (validItems.length === 0) {
    throw new Error("No valid PR items found!");
  }

  return {
    PrHeader: {
      DocType: options.docType || "ZNB1",
      CreatedBy: options.createdBy || sessionStorage.getItem("Userid") || "AMPLCONS1",
      Currency: options.currency || "INR", // default currency
      PurchaseGroup: options.purchGroup || "110", // default Purch. Group
      CompanyCode: options.companyCode || "3100"  // default Company Code
    },
    PrItems: validItems.map(item => ({
      Material: item.matnr,
      Quantity: Number(item.OrdQty),
      Plant: item.site_plant || options.defaultPlant || "",
      ShortText: item.txz01?.substring(0, 40) || "No Description", // SAP limit 40 chars
      Urgency: item.prio_urg || "",
      Status: item.Status || "",
    //   PRNumber: item.banfn || "", // only if existing
    //   PRLine: item.bnfpo || "",   // only if existing
      DeliveryDate: item.deliveryDate || options.defaultDelivery || new Date().toISOString().slice(0, 10)+3
    }))
  };
};
