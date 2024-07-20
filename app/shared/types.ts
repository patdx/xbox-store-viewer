type DateString = string;

export interface Product {
	LastModifiedDate: DateString;
	LocalizedProperties: ProductLocalizedProperty[];
	MarketProperties: ProductMarketProperty[];
	ProductASchema: string;
	ProductBSchema: string;
	ProductId: string;
	Properties: ProductProperties;
	AlternateIds: AlternateID[];
	DomainDataVersion: null;
	IngestionSource: string;
	IsMicrosoftProduct: boolean;
	PreferredSkuId: string;
	ProductType: string;
	ValidationData: ValidationData;
	MerchandizingTags: any[];
	PartD: string;
	SandboxId: string;
	ProductFamily: string;
	SchemaVersion: string;
	IsSandboxedProduct: boolean;
	ProductKind: string;
	ProductPolicies: ProductPolicies;
	DisplaySkuAvailabilities: DisplaySkuAvailability[];
}

export interface AlternateID {
	IdType: string;
	Value: string;
}

export interface DisplaySkuAvailability {
	Sku: Sku;
	Availabilities: Availability[];
	HistoricalBestAvailabilities: HistoricalBestAvailability[];
}

export interface Availability {
	Actions: string[];
	AvailabilityASchema: string;
	AvailabilityBSchema: string;
	AvailabilityId: string;
	Conditions: AvailabilityConditions;
	LastModifiedDate: DateString;
	Markets: string[];
	OrderManagementData: AvailabilityOrderManagementData;
	Properties: AvailabilityProperties;
	SkuId: string;
	DisplayRank: number;
	AlternateIds?: AlternateID[];
	RemediationRequired: boolean;
	LicensingData?: LicensingData;
}

export interface AvailabilityConditions {
	ClientConditions: ClientConditions;
	EndDate: DateString;
	ResourceSetIds: string[];
	StartDate: DateString;
}

export interface ClientConditions {
	AllowedPlatforms: AllowedPlatform[];
}

export interface AllowedPlatform {
	MaxVersion: number;
	MinVersion: number;
	PlatformName: string;
}

export interface LicensingData {
	SatisfyingEntitlementKeys: SatisfyingEntitlementKey[];
}

export interface SatisfyingEntitlementKey {
	EntitlementKeys: string[];
	LicensingKeyIds: string[];
	PreOrderReleaseDate?: DateString;
}

export interface AvailabilityOrderManagementData {
	GrantedEntitlementKeys: any[];
	PIFilter?: PIFilter;
	Price: Price;
	OrderManagementPolicyIdOverride?: string;
	GeofencingPolicyId?: string;
}

export interface PIFilter {
	ExclusionProperties: any[];
	InclusionProperties: any[];
}

export interface Price {
	CurrencyCode: string;
	IsPIRequired: boolean;
	ListPrice: number;
	MSRP: number;
	TaxType: string;
	WholesaleCurrencyCode: string;
	WholesalePrice?: number;
}

export interface AvailabilityProperties {
	OriginalReleaseDate?: DateString;
}

export interface HistoricalBestAvailability {
	Actions: string[];
	AvailabilityASchema: string;
	AvailabilityBSchema: string;
	AvailabilityId: string;
	Conditions: HistoricalBestAvailabilityConditions;
	LastModifiedDate: DateString;
	Markets: string[];
	OrderManagementData: HistoricalBestAvailabilityOrderManagementData;
	Properties: AvailabilityProperties;
	SkuId: string;
	DisplayRank: number;
	AlternateIds: AlternateID[];
	ProductASchema: string;
}

export interface HistoricalBestAvailabilityConditions {
	ClientConditions: ClientConditions;
	EndDate: DateString;
	ResourceSetIds: string[];
	StartDate: DateString;
	EligibilityPredicateIds: string[];
	SupportedCatalogVersion: number;
}

export interface HistoricalBestAvailabilityOrderManagementData {
	GrantedEntitlementKeys: any[];
	PIFilter: PIFilter;
	Price: Price;
}

export interface Sku {
	LastModifiedDate: DateString;
	LocalizedProperties: SkuLocalizedProperty[];
	MarketProperties: SkuMarketProperty[];
	ProductId: string;
	Properties: SkuProperties;
	SkuASchema: string;
	SkuBSchema: string;
	SkuId: string;
	SkuType: string;
	RecurrencePolicy: null;
	SubscriptionPolicyId: null;
}

export interface SkuLocalizedProperty {
	Contributors: any[];
	Features: any[];
	MinimumNotes: string;
	RecommendedNotes: string;
	ReleaseNotes: string;
	DisplayPlatformProperties: null;
	SkuDescription: string;
	SkuTitle: string;
	SkuButtonTitle: string;
	DeliveryDateOverlay: null;
	SkuDisplayRank: any[];
	TextResources: null;
	Images: any[];
	LegalText: LegalText;
	Language: string;
	Markets: string[];
}

export interface LegalText {
	AdditionalLicenseTerms: string;
	Copyright: string;
	CopyrightUri: string;
	PrivacyPolicy: string;
	PrivacyPolicyUri: string;
	Tou: string;
	TouUri: string;
}

export interface SkuMarketProperty {
	FirstAvailableDate: DateString;
	SupportedLanguages: string[];
	PIFilter: null;
	Markets: string[];
}

export interface SkuProperties {
	EarlyAdopterEnrollmentUrl: null;
	FulfillmentData: FulfillmentData;
	FulfillmentType: string;
	FulfillmentPluginId: null;
	HasThirdPartyIAPs: boolean;
	LastUpdateDate: DateString;
	HardwareProperties: HardwareProperties;
	HardwareRequirements: any[];
	HardwareWarningList: any[];
	InstallationTerms: string;
	Packages: Package[];
	VersionString: string;
	SkuDisplayGroupIds: string[] | null;
	XboxXPA: boolean;
	BundledSkus: any[];
	IsRepurchasable: boolean;
	SkuDisplayRank: number;
	DisplayPhysicalStoreInventory: null;
	VisibleToB2BServiceIds: any[];
	AdditionalIdentifiers: any[];
	IsTrial: boolean;
	IsPreOrder: boolean;
	IsBundle: boolean;
}

export interface FulfillmentData {
	ProductId: string;
	WuBundleId: string;
	WuCategoryId: string;
	PackageFamilyName: string;
	SkuId: string;
	Content: null;
	PackageFeatures: PackageFeatures;
}

export interface PackageFeatures {
	SupportsIntelligentDelivery: boolean;
	SupportsInstallFeatures: boolean;
	SupportsInstallRecipes: boolean;
}

export interface HardwareProperties {
	MinimumHardware: any[];
	RecommendedHardware: any[];
	MinimumProcessor: string;
	RecommendedProcessor: string;
	MinimumGraphics: string;
	RecommendedGraphics: string;
}

export interface Package {
	Applications: any[];
	Architectures: string[];
	Capabilities: any[];
	DeviceCapabilities: any[];
	ExperienceIds: any[];
	FrameworkDependencies: any[];
	HardwareDependencies: any[];
	HardwareRequirements: any[];
	Hash: string;
	HashAlgorithm: string;
	IsStreamingApp: boolean;
	Languages: string[];
	MaxDownloadSizeInBytes: number;
	MaxInstallSizeInBytes: number;
	PackageFormat: string;
	PackageFamilyName: null;
	MainPackageFamilyNameForDlc: null;
	PackageFullName: string;
	PackageId: string;
	ContentId: string;
	KeyId: string;
	PackageRank: number;
	PackageUri: string;
	PlatformDependencies: PlatformDependency[];
	PlatformDependencyXmlBlob: string;
	ResourceId: string;
	Version: string;
	PackageDownloadUris: PackageDownloadUris[];
	DriverDependencies: any[];
	FulfillmentData: FulfillmentData;
}

export interface PackageDownloadUris {
	Rank: number;
	Uri: string;
}

export interface PlatformDependency {
	MaxTested: number;
	MinVersion: number;
	PlatformName: string;
}

export interface ProductLocalizedProperty {
	DeveloperName: string;
	PublisherName: string;
	PublisherAddress: null;
	PublisherWebsiteUri: string;
	SupportUri: string;
	SupportPhone: null;
	EligibilityProperties: EligibilityProperties;
	Franchises: any[];
	Images: Image[];
	Videos: Video[];
	ProductDescription: string;
	ProductTitle: string;
	ShortTitle: string;
	SortTitle: string;
	FriendlyTitle: null;
	ShortDescription: string;
	SearchTitles: SearchTitle[];
	VoiceTitle: string;
	RenderGroupDetails: null;
	ProductDisplayRanks: any[];
	InteractiveModelConfig: null;
	Interactive3DEnabled: boolean;
	Language: string;
	Markets: string[];
}

export interface EligibilityProperties {
	Remediations: Remediation[];
	Affirmations: any[];
}

export interface Remediation {
	RemediationId: string;
	Description: string;
}

export interface Image {
	FileId: string;
	EISListingIdentifier: null;
	BackgroundColor: null | string;
	Caption: string;
	FileSizeInBytes: number;
	ForegroundColor: null | string;
	Height: number;
	ImagePositionInfo: null | string;
	ImagePurpose: string;
	UnscaledImageSHA256Hash: string;
	Uri: string;
	Width: number;
}

export interface SearchTitle {
	SearchTitleString: string;
	SearchTitleType: string;
}

export interface Video {
	Uri: string;
	VideoPurpose: string;
	Height: number;
	Width: number;
	AudioEncoding: string;
	VideoEncoding: string;
	VideoPositionInfo: string;
	Caption: string;
	FileSizeInBytes: number;
	PreviewImage: Image;
	TrailerId: string;
	SortOrder: number;
}

export interface ProductMarketProperty {
	OriginalReleaseDate: DateString;
	MinimumUserAge: number;
	ContentRatings: ContentRating[];
	RelatedProducts: RelatedProduct[];
	UsageData: UsageDatum[];
	BundleConfig: null;
	Markets: string[];
}

export interface ContentRating {
	RatingSystem: string;
	RatingId: string;
	RatingDescriptors: string[];
	RatingDisclaimers: string[];
	InteractiveElements: any[];
}

export interface RelatedProduct {
	RelatedProductId: string;
	RelationshipType: string;
}

export interface UsageDatum {
	AggregateTimeSpan: string;
	AverageRating: number;
	PlayCount: number;
	RatingCount: number;
	RentalCount: string;
	TrialCount: string;
	PurchaseCount: string;
}

export interface ProductPolicies {}

export interface ProductProperties {
	Attributes: Attribute[];
	CanInstallToSDCard: boolean;
	Category: string;
	Categories: string[];
	Subcategory: null;
	IsAccessible: boolean;
	IsDemo: boolean;
	IsLineOfBusinessApp: boolean;
	IsPublishedToLegacyWindowsPhoneStore: boolean;
	IsPublishedToLegacyWindowsStore: boolean;
	PackageFamilyName: string;
	PackageIdentityName: string;
	PublisherCertificateName: string;
	PublisherId: string;
	SkuDisplayGroups: SkuDisplayGroup[];
	XboxLiveTier: string;
	XboxXPA: null;
	XboxCrossGenSetId: null;
	XboxConsoleGenOptimized: string[];
	XboxConsoleGenCompatible: string[];
	XboxLiveGoldRequired: boolean;
	ExtendedMetadata: string;
	XBOX: Xbox;
	ExtendedClientMetadata: ProductPolicies;
	OwnershipType: null;
	PdpBackgroundColor: string;
	HasAddOns: boolean;
	RevisionId: DateString;
	ProductGroupId: string;
	ProductGroupName: string;
}

export interface Attribute {
	Name: string;
	Minimum: number | null;
	Maximum: number | null;
	ApplicablePlatforms: string[] | null;
	Group: null;
}

export interface SkuDisplayGroup {
	Id: string;
	Treatment: string;
}

export interface Xbox {
	XboxProperties: string;
	SubmissionId: string;
	XboxGamingMetadata: string;
}

export interface ValidationData {
	PassedValidation: boolean;
	RevisionId: string;
	ValidationResultUri: string;
}
