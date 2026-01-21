import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { healthMetricsAPI } from "@/lib/api";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Heart, Droplets, Scale, Save } from "lucide-react";
import { format } from "date-fns";

const HealthMetricsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    type: "bloodPressure",
    systolic: "",
    diastolic: "",
    value: "",
    unit: "",
    notes: "",
    recordedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  // Fetch existing metric if editing
  const { data: existingMetric, isLoading: isLoadingMetric } = useQuery({
    queryKey: ["healthMetric", id],
    queryFn: () => healthMetricsAPI.getById(id).then(res => res.data.data),
    enabled: isEdit,
  });

  // Populate form when editing
  useEffect(() => {
    if (existingMetric) {
      const recordedAt = existingMetric.recordedAt 
        ? format(new Date(existingMetric.recordedAt), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm");
      
      setFormData({
        type: existingMetric.type,
        systolic: existingMetric.systolic || "",
        diastolic: existingMetric.diastolic || "",
        value: existingMetric.value || "",
        unit: existingMetric.unit || "",
        notes: existingMetric.notes || "",
        recordedAt,
      });
    }
  }, [existingMetric]);

  const mutation = useMutation({
    mutationFn: (data) => {
      return isEdit 
        ? healthMetricsAPI.update(id, data)
        : healthMetricsAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["healthMetrics"] });
      toast.success(isEdit ? "Health metric updated successfully" : "Health metric added successfully");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to save health metric");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      type: formData.type,
      notes: formData.notes,
      recordedAt: formData.recordedAt,
    };

    if (formData.type === "bloodPressure") {
      if (!formData.systolic || !formData.diastolic) {
        toast.error("Please enter both systolic and diastolic values");
        return;
      }
      submitData.systolic = parseFloat(formData.systolic);
      submitData.diastolic = parseFloat(formData.diastolic);
    } else {
      if (!formData.value) {
        toast.error("Please enter a value");
        return;
      }
      submitData.value = parseFloat(formData.value);
      if (formData.unit) {
        submitData.unit = formData.unit;
      }
    }

    mutation.mutate(submitData);
  };

  const getIcon = () => {
    switch (formData.type) {
      case "bloodPressure":
        return <Heart className="w-6 h-6 text-[#00b4d8]" />;
      case "bloodSugar":
        return <Droplets className="w-6 h-6 text-[#bbd0ff]" />;
      case "weight":
        return <Scale className="w-6 h-6 text-[#eae0d5]" />;
      default:
        return null;
    }
  };

  const getGradient = () => {
    switch (formData.type) {
      case "bloodPressure":
        return "from-[#00b4d8]/20 to-[#caf0f8]/20";
      case "bloodSugar":
        return "from-[#bbd0ff]/20 to-[#caf0f8]/20";
      case "weight":
        return "from-[#eae0d5]/20 to-[#f7ede2]/20";
      default:
        return "from-[#00b4d8]/20 to-[#caf0f8]/20";
    }
  };

  if (isEdit && isLoadingMetric) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#f7ede2] via-[#caf0f8] to-[#f7ede2]">
        <Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7ede2] via-[#caf0f8] to-[#f7ede2] py-8">
      <div className="container mx-auto p-4 md:p-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-6 text-[#00b4d8] hover:text-[#0099c4] hover:bg-[#caf0f8]/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-[#00b4d8]/20">
              <CardHeader className={`bg-gradient-to-r ${getGradient()} border-b border-[#eae0d5]`}>
                <div className="flex items-center gap-3">
                  {getIcon()}
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {isEdit ? "Edit" : "Add"} Health Metric
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Record your health measurements
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Metric Type */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="type" className="text-base font-semibold text-gray-700">
                      Metric Type
                    </Label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-[#eae0d5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent bg-white text-gray-800 font-medium transition-all"
                      disabled={isEdit}
                    >
                      <option value="bloodPressure">Blood Pressure</option>
                      <option value="bloodSugar">Blood Sugar</option>
                      <option value="weight">Weight</option>
                    </select>
                  </motion.div>

                  {/* Blood Pressure Fields */}
                  {formData.type === "bloodPressure" && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="systolic" className="text-base font-semibold text-gray-700">
                          Systolic (mmHg)
                        </Label>
                        <Input
                          id="systolic"
                          name="systolic"
                          type="number"
                          value={formData.systolic}
                          onChange={handleChange}
                          placeholder="120"
                          className="border-2 border-[#eae0d5] focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/20 h-12 text-lg"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="diastolic" className="text-base font-semibold text-gray-700">
                          Diastolic (mmHg)
                        </Label>
                        <Input
                          id="diastolic"
                          name="diastolic"
                          type="number"
                          value={formData.diastolic}
                          onChange={handleChange}
                          placeholder="80"
                          className="border-2 border-[#eae0d5] focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/20 h-12 text-lg"
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Blood Sugar Fields */}
                  {formData.type === "bloodSugar" && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="value" className="text-base font-semibold text-gray-700">
                          Blood Sugar (mg/dL)
                        </Label>
                        <Input
                          id="value"
                          name="value"
                          type="number"
                          step="0.1"
                          value={formData.value}
                          onChange={handleChange}
                          placeholder="100"
                          className="border-2 border-[#eae0d5] focus:border-[#bbd0ff] focus:ring-2 focus:ring-[#bbd0ff]/20 h-12 text-lg"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit" className="text-base font-semibold text-gray-700">
                          Unit
                        </Label>
                        <Input
                          id="unit"
                          name="unit"
                          value={formData.unit || "mg/dL"}
                          onChange={handleChange}
                          className="border-2 border-[#eae0d5] h-12 text-lg bg-gray-50"
                          disabled
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Weight Fields */}
                  {formData.type === "weight" && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="value" className="text-base font-semibold text-gray-700">
                          Weight (kg)
                        </Label>
                        <Input
                          id="value"
                          name="value"
                          type="number"
                          step="0.1"
                          value={formData.value}
                          onChange={handleChange}
                          placeholder="70"
                          className="border-2 border-[#eae0d5] focus:border-[#eae0d5] focus:ring-2 focus:ring-[#eae0d5]/20 h-12 text-lg"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit" className="text-base font-semibold text-gray-700">
                          Unit
                        </Label>
                        <Input
                          id="unit"
                          name="unit"
                          value={formData.unit || "kg"}
                          onChange={handleChange}
                          className="border-2 border-[#eae0d5] h-12 text-lg bg-gray-50"
                          disabled
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Recorded At */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="recordedAt" className="text-base font-semibold text-gray-700">
                      Date & Time
                    </Label>
                    <Input
                      id="recordedAt"
                      name="recordedAt"
                      type="datetime-local"
                      value={formData.recordedAt}
                      onChange={handleChange}
                      className="border-2 border-[#eae0d5] focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/20 h-12 text-lg"
                      required
                    />
                  </motion.div>

                  {/* Notes */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="notes" className="text-base font-semibold text-gray-700">
                      Notes (Optional)
                    </Label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-[#eae0d5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent bg-white text-gray-800 resize-none transition-all"
                      placeholder="Any additional notes..."
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-4 pt-4"
                  >
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="flex-1 h-12 bg-[#00b4d8] hover:bg-[#0099c4] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          {isEdit ? "Update Metric" : "Add Metric"}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                      className="h-12 border-2 border-[#eae0d5] hover:bg-[#caf0f8]/50 text-gray-700 font-semibold"
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthMetricsForm;
