import { useState } from "react";
import { GlowingCard } from "@/components/GlowingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserInfo } from "@/api";
import { ChevronLeft, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Step2BasicInfoProps {
  onNext: (userInfo: UserInfo) => void;
  onBack: () => void;
  loading: boolean;
  initialData?: UserInfo | null;
}

const companySizeOptions = [
  { value: "1-5", label: "1–5 employees" },
  { value: "6-20", label: "6–20 employees" },
  { value: "21-50", label: "21–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
];

export function Step2BasicInfo({ onNext, onBack, loading, initialData }: Step2BasicInfoProps) {
  const [userInfo, setUserInfo] = useState<UserInfo & { companySize?: string }>({
    firstName: initialData?.firstName || "",
    email: initialData?.email || "",
    businessName: initialData?.businessName || "",
    country: initialData?.country || "",
    industry: initialData?.industry || "",
    companySize: (initialData as any)?.companySize || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(userInfo);
  };

  const isValid =
    userInfo.firstName.trim() &&
    userInfo.email.trim() &&
    userInfo.businessName.trim() &&
    userInfo.industry.trim() &&
    userInfo.companySize;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
          Tell us about your business
        </h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          We'll use this information to personalize your assessment and insights. No spam. No sales pressure.
        </p>
      </div>

      <GlowingCard className="max-w-2xl mx-auto glass-card-solid">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: First Name & Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground text-sm font-medium">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                value={userInfo.firstName}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, firstName: e.target.value })
                }
                className="input-enterprise"
                placeholder="Your first name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
                className="input-enterprise"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>

          {/* Row 2: Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-foreground text-sm font-medium">
              Business Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="businessName"
              type="text"
              value={userInfo.businessName}
              onChange={(e) =>
                setUserInfo({ ...userInfo, businessName: e.target.value })
              }
              className="input-enterprise"
              placeholder="Your company name"
              required
            />
          </div>

          {/* Row 3: Industry & Company Size */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-foreground text-sm font-medium">
                Industry <span className="text-destructive">*</span>
              </Label>
              <Input
                id="industry"
                type="text"
                value={userInfo.industry}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, industry: e.target.value })
                }
                className="input-enterprise"
                placeholder="e.g. Technology, Healthcare"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySize" className="text-foreground text-sm font-medium">
                Company Size <span className="text-destructive">*</span>
              </Label>
              <Select
                value={userInfo.companySize}
                onValueChange={(value) =>
                  setUserInfo({ ...userInfo, companySize: value })
                }
              >
                <SelectTrigger className="input-enterprise w-full">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {companySizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: Country (optional) */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-foreground text-sm font-medium">
              Country
            </Label>
            <Input
              id="country"
              type="text"
              value={userInfo.country}
              onChange={(e) =>
                setUserInfo({ ...userInfo, country: e.target.value })
              }
              className="input-enterprise"
              placeholder="Your country (optional)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={!isValid || loading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting Assessment...
                </>
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </form>
      </GlowingCard>
    </div>
  );
}